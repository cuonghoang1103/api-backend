/*DU_LIEU*/
const DU_LIEU = {
 "n20-1:file:src/app/ver/page.tsx": "// app/ver/page.tsx — a static page that says which version it is\nexport default function Page() {\n  return <main className=\"p-6\"><h1 className=\"text-2xl font-bold\">Release v1</h1></main>;\n}\n",
 "n20-1:file:src/app/gio/page.tsx": "// app/gio/page.tsx — a dynamic page: the server's clock, per request\nimport { connection } from 'next/server';\nexport default async function Page() {\n  await connection();\n  return <main className=\"p-6\"><p>Server time: {new Date().toISOString()}</p></main>;\n}\n",
 "n20-1:chua": "$ npx next start -p 3000   # no build yet\n- Network:       http://127.0.0.1:19341\n✓ Ready in 113ms\n\n✓ Running next.config.ts took 22ms\nError: Could not find a production build in the '.next' directory. Try building your app with 'next build' before starting the production server. https://nextjs.org/docs/messages/production-start-no-build-id\n    at ignore-listed frames\n$ curl -s -o /dev/null -w '%{http_code}' localhost:3000/ver\nHTTP 000\nError: Could not find a production build in the '.next' directory. Try building your app with 'next build' before starting the production server. https://nextjs",
 "n20-1:build": "$ npm run build\n▲ Next.js 16.4.6 (Turbopack)\n  Creating an optimized production build ...\n✓ Compiled successfully in 9.0s\n  Running TypeScript ...\n  Finished TypeScript in 1436ms ...\n  Collecting page data using 9 workers ...\n✓ Generating static pages using 9 workers (11/11) in 162ms\n  Finalizing page optimization ...\nƒ /gio\n○ /ver\nreal 12.03\n$ du -sh .next | awk '{print \".next: \" $1}'; ls .next | tr '\\n' ' '; echo\n.next: 33M\napp-path-routes-manifest.json build BUILD_ID build-manifest.json cache diagnostics export-marker.json fallback-build-manifest.json images-manifest.json next-minimal-server.js.nft.json next-server.js.nft.json package.json prerender-manifest.json required-server-files.js required-server-files.json routes-manifest.json server static trace trace-build turbopack types ",
 "n20-1:cu": "$ curl -s http://127.0.0.1:19341/ver | grep -o 'Release v[0-9]' | head -1\nRelease v1\n$ sed -i 's/Release v1/Release v2/' src/app/ver/page.tsx   # change the SOURCE, restart, no build\nsource: Release v2\n$ curl -s localhost:3000/ver | grep -o 'Release v[0-9]'   # after restart\nRelease v1\n$ npm run build && npx next start   # after a real build\nRelease v2",
 "n20-1:file:src/app/sai/page.tsx": "// app/sai/page.tsx — a type error that dev tolerates\nexport default function Page() {\n  const total: number = 'one hundred';\n  return <main className=\"p-6\">Total: {total}</main>;\n}\n",
 "n20-1:kieu": "$ npm run dev   →   curl localhost:3000/sai\nnext dev /sai → HTTP 200\nTotal: one hundred\n$ npm run build\n✓ Compiled successfully in 569ms\nsrc/app/sai/page.tsx(3,9): error TS2322: Type 'string' is not assignable to type 'number'.\nFailed to type check.",
 "n20-1:dev": "$ for s in \"next start\" \"next dev\"; do curl -w '%{time_total}' …/gio (first, second); done\nnext start /gio: 1st 46 ms · 2nd 7 ms\nnext dev   /gio: 1st 2894 ms · 2nd 29 ms\n$ ps -o rss= -p <pid>   # memory of each server\nnext start RSS 102 MB\nnext dev   RSS 502 MB",
 "n20-1:kho": "$ grep -n \"output: 'standalone'\" frontend/next.config.js; grep -nE '^RUN npm run build|^CMD ' frontend/Dockerfile\n6:  output: 'standalone',\n140:RUN npm run build\n175:CMD [\"node\", \"server.js\"]\n$ grep -n 'Smoke-testing core API routes' deploy.sh deploy-nha.sh | head -3\ndeploy.sh:1010:info \"Smoke-testing core API routes are mounted...\"\n$ grep -n '2026-07-02 | GIF picker dead' CLAUDE.md | cut -c1-160\n817:| 2026-07-02 | GIF picker dead + \"chats disappearing\" together, survived re-login. Root cause: prod ran a **stale `dist/index.js`** that never mounted `/api"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, meter, path, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n20-1 · lab c20 = c19 · Next.js 16.4.6 · next start 19341 · next dev 19342 · Mac của khoá)
export const deck = { key: 'nxj-20-1', code: 'NXJ 20.1', title: 'What deploying means: build vs start', sub: 'Chapter 20 · Lesson 20.1' };
const O = (k) => { const v = DU_LIEU[`n20-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (khoi, dau) => { const l = O(khoi).split('\n'); const i = l.findIndex((x) => x.startsWith('$ ') && x.includes(dau)); if (i < 0) throw new Error('thiếu lệnh ' + dau); const r = []; for (let j = i + 1; j < l.length && !l[j].startsWith('$ '); j++) r.push(l[j]); return r; };
const tim = (ds, re) => { const l = ds.find((x) => re.test(x)); if (!l) throw new Error('thiếu dòng ' + re); return l; };
const so = (s, re) => { const m = s.match(re); if (!m) throw new Error('không khớp ' + re); return +m[1]; };
const sach = (ds) => ds.map((l) => l.trim()).filter(Boolean);
const CHUA = O('chua').split('\n').filter((l) => !l.startsWith('$ ') && l.trim()), BUILD = doan('build', 'npm run build'), SIZE = doan('build', 'du -sh');
const CU = O('cu').split('\n'), KIEU = O('kieu').split('\n'), TIME = doan('dev', 'time_total'), RSS = doan('dev', 'ps -o rss');
const KHO = O('kho').split('\n').filter((l) => !l.startsWith('$ '));
const T = (n, k) => so(tim(TIME, new RegExp('^' + n)), new RegExp(k + ' (\\d+) ms')), R = (n) => so(tim(RSS, new RegExp('^' + n)), /RSS (\d+) MB/);
const BUILD_S = so(tim(BUILD, /^real/), /real ([\d.]+)/);
if (!/connection\(\)/.test(O('file:src/app/gio/page.tsx'))) throw new Error('mã lab đổi');

export const S = [
  { cover: true, nhan: 'Chapter 20 · Lesson 20.1 · Course finale', t: 'What deploying means:<br>build vs start', sub: 'Production runs the build, not your source — measured: a start with no build, a source change nobody sees, a type error dev lets through',
    en: 'Lesson twenty point one: what deploying means, build versus start. Production runs the build, not your source. Measured: a start with no build, a source change nobody sees, and a type error the dev server lets through.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>next build</code> compiles, type-checks and pre-renders — in <b>${BUILD_S} s</b> here; Next.js 16 no longer lints</li>
    <li><code>next start</code> with no build prints <b>✓ Ready</b> — then dies</li>
    <li>Change the source, restart: still <b>Release v1</b>. Only a build ships v2</li>
    <li>A type error: <code>next dev</code> serves it (<b>HTTP 200</b>), <code>next build</code> refuses</li>
    <li>First request: start <b>${T('next start', '1st')} ms</b> vs dev <b>${T('next dev', '1st').toLocaleString('en-US')} ms</b>; memory ${R('next start')} vs ${R('next dev')} MB</li></ul>`,
    en: `Five takeaways. Build compiles, type-checks and pre-renders, and in Next.js sixteen it no longer lints. Start with no build prints ready, then dies. A changed source does nothing until you build. dev serves a type error that build refuses. And dev is slower and heavier than start.` },
  { t: 'Three commands, three jobs', body: icards([
      ['code', 'next dev — for you', 'Compiles each page on demand, hot-reloads, development React, no type-check. Never for users.'],
      ['package', 'next build — once per release', 'Compiles, type-checks, bundles, pre-renders every static route into <code>.next/</code>. Decides ○ vs ƒ.'],
      ['server', 'next start — for users', 'Serves what <code>.next/</code> contains. Compiles nothing. No build ⇒ nothing to serve.'],
      ['refresh', 'A deploy = build, then start', 'Restarting without building is running the previous release.'],
    ], 2),
    en: 'Three commands, three jobs. next dev is for you: it compiles on demand and never type-checks. next build runs once per release and writes everything into the dot next folder. next start serves that folder and compiles nothing. A deploy is a build, then a start.' },
  { t: 'next build, for real', body: two(D(tn(sach(BUILD).join('\n'), { fs: 15, wrap: 56, title: 'npm run build (real)' })),
    D(tn(sach(SIZE).slice(0, 1).join('\n'), { fs: 14, wrap: 50, title: 'what it produced (real)' }),
      box('No lint step any more', 'The output has <b>Running TypeScript</b> but no lint line: Next.js 16 removed <code>next lint</code> from the build. Run ESLint yourself (or in CI).', 'do2'),
      box('○ /ver · ƒ /gio', 'Static vs dynamic is decided <i>here</i> (Chapter 17). <code>/gio</code> calls <code>connection()</code> ⇒ rendered per request.', 'lam')), 'r64'),
    en: `next build, for real: compiled, type-checked, pages pre-rendered, about ${BUILD_S} seconds on the course machine, thirty-three megabytes in the dot next folder. Notice what is missing: there is no lint step in Next.js sixteen. And the route table decides static versus dynamic here.` },
  { t: 'next start with no build: “Ready”, then dead', body: two(D(tn(CHUA.slice(0, 6).join('\n'), { fs: 14, wrap: 64, title: 'npx next start (no .next) — the log (real)' })),
    D(box('It said ✓ Ready', 'A health check that only reads the log would pass. A second later the process exits: <i>Could not find a production build in the \'.next\' directory</i>.', 'do2'),
      box('The port is closed', '<code>curl</code> got <b>HTTP 000</b> — no server at all. Check the URL, not the log line.', 'lam')), 'r64'),
    en: 'next start with no build. It prints Ready in about a hundred milliseconds, then crashes: could not find a production build in the dot next directory. curl gets nothing at all. A health check that only reads the log would have passed. Check the URL, not the log line.' },
  { t: 'Production runs the build, not your source', body: two(D(tn(sach(CU).join('\n'), { fs: 15, wrap: 64, title: 'edit the source, restart, then build (real)' }),
      path([{ t: 'source', s: 'v2 (edited)', mau: '#0070f3' }, { t: '.next/', s: 'still v1', mau: '#dc2626', on: true }, { t: 'next start', s: 'serves v1', mau: '#475569' }], { w: 640, h: 150, fs: 19, nhan: ['no build', 'reads'] })),
    D(box('Restart ≠ deploy', 'The server re-read <code>.next/</code>, which still holds v1. Your edit exists only in a file the server never looks at.', 'do2'),
      box('This is the “stale build” bug', 'Lesson 20.4: a deploy that copies files and restarts — without building — ships the old release.', 'lam')), 'r64'),
    en: 'Production runs the build, not your source. The page says Release v1. Edit the source to v2 and restart: still v1, because the server reads the dot next folder, which still holds v1. Only after a real build does it say v2. Restarting is not deploying.' },
  { t: 'A type error that dev lets through', body: two(D(tsx("// app/sai/page.tsx\nexport default function Page() {\n  const total: number = 'one hundred';\n  return <main>Total: {total}</main>;\n}", { hl: [3] }),
      tn(sach(KIEU).join('\n'), { fs: 14, wrap: 64, title: 'next dev, then next build (real)' })),
    D(box('Dev never type-checks', 'It compiles TypeScript by stripping the types — the page renders <i>Total: one hundred</i>, HTTP 200.', 'do2'),
      box('The build is the gate', '<code>Failed to type check.</code> — nothing ships. Run <code>next build</code> locally before every deploy.', 'xanh')), 'r46'),
    en: 'A type error the dev server lets through. A number assigned a string: next dev renders the page, HTTP two hundred, because it strips types without checking them. next build refuses: failed to type check. The build is the gate; run it before every deploy.' },
  { t: 'Dev is not a slower production — it is a different program', body: two(D(meter([['next start · 1st request', T('next start', '1st'), '#16a34a'], ['next dev · 1st request', T('next dev', '1st'), '#dc2626'], ['next start · 2nd', T('next start', '2nd'), '#16a34a'], ['next dev · 2nd', T('next dev', '2nd'), '#dc2626']], { don: 'ms', w: 620, nhan: 250, fs: 17 }),
      meter([['next start · memory', R('next start'), '#16a34a'], ['next dev · memory', R('next dev'), '#dc2626']], { don: 'MB', w: 620, nhan: 250, fs: 17 })),
    D(tn([...sach(TIME), ...sach(RSS)].join('\n'), { fs: 14, wrap: 50, title: 'same page /gio (real, Mac of the course)' }),
      box('Never serve users with dev', 'First visit compiles the page; every response carries dev tooling; memory is ~5×. On a 6 GB VPS that difference matters.', 'do2')), 'r64'),
    en: `Dev is not a slower production; it is a different program. The same dynamic page: start answers the first request in ${T('next start', '1st')} milliseconds, dev in ${T('next dev', '1st').toLocaleString('en-US')}, because dev compiles on the first visit. Memory: about ${R('next start')} versus ${R('next dev')} megabytes.` },
  { t: 'cuongthai.com: build in the image, start in the container', body: two(D(tn(KHO.join('\n'), { fs: 13, wrap: 64, title: 'api-backend (real)' })),
    D(box('Standalone + node server.js', '<code>output: \'standalone\'</code>; the image runs <code>npm run build</code> once, the container runs <code>node server.js</code> — the standalone form of <code>next start</code> (20.3).', 'lam'),
      box('The day a stale build shipped', '02/07/2026: a deploy synced files without building; the running bundle never mounted the new GIF route ⇒ 404. Since then: a post-deploy smoke test fails the deploy on any 404.', 'do2')), 'r64'),
    en: 'This course’s own site. The frontend builds as standalone; the image runs npm run build once and the container runs node server dot js. And on the second of July, a deploy synced files without building: the running bundle never had the new GIF route. Since then a smoke test fails any deploy that returns a four oh four.' },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['🚀', '“I pushed the fix, it’s not live”', ['the server restarted on the old .next/', 'nobody ran the build']],
      neu: ['❓', 'What if you ship next dev?', ['~5× memory, first visits in seconds', 'dev overlays and source paths for everyone']],
      xau: ['🕵️', 'Dev servers leak', ['stack traces with file paths', 'source maps; an open dev port on a VPS']],
      phong: ['🛡️', 'Build locally, start in prod, check URLs', ['next build before every deploy', 'smoke-test routes; never expose next dev']],
    }),
    en: 'Real life: I pushed the fix and it is not live, because the server restarted on the old build. What if you ship next dev? Five times the memory, slow first visits. Dev servers also leak: stack traces, file paths, source maps. Build locally, start in production, and check URLs after every deploy.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('next dev', 'on-demand, no type-check'), kw('next build', 'compile · type-check · pre-render'), kw('next start', 'serves .next/'), kw('.next/', 'the release'),
      kw('BUILD_ID', 'which build is this'), kw('Stale build', 'old .next/ still served'), kw('Type-check gate', 'build refuses'), kw('Standalone', 'node server.js'), kw('Smoke test', 'curl routes after deploy'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: next dev; next build; next start; the dot next folder; BUILD_ID; stale build; the type-check gate; standalone; and smoke test.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Delete ${c('.next')}, run ${c('next start')}: read the log, then curl`,
      `Build; change a page; restart without building; curl again`,
      `Add a type error: ${c('next dev')} vs ${c('next build')}`,
      `Write a 3-line smoke test: ${c('curl -s -o /dev/null -w "%{http_code}"')} per route`,
    ]), box('Keep these', `<ul><li>Production runs the build</li><li>Restart ≠ deploy</li><li>The build is the type gate (no lint in 16)</li><li>Check URLs, not log lines</li></ul>`, 'lam'), ''),
    en: 'Your turn: start without a build and compare the log with curl; change a page and restart without building; add a type error and compare dev with build; and write a three-line smoke test that curls each route.' },
];
export const slides = lamDeck({ chuong: 'Chapter 20 — Build and deploy to production', bai: '20.1' }, S);
