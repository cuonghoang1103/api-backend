/**
 * nxj-00-9 — Next.js · Section 0 · Start here (2/2) "How to learn this without drowning" (deck video + web, 13/11/2026).
 * Bài web: nextjs-0-0-bat-dau-2. Output THẬT (scratchpad/nxj/demo/n0-9.txt · Next.js 16.4.6 · Node 22.23.3, Mac) — ba sự cố CÓ NGUỒN dựng lại:
 * (1) cuongthai.com 30/07/2026 (CLAUDE.md "Known Error Patterns"): tệp mới vào public/ sau khi `next start` ⇒ 404 tới khi khởi động lại ⇒ 200.
 * (2) cuongthai.com 02/07/2026: NEXT_PUBLIC_ bị NƯỚNG lúc build — build với khoa-cu, chạy với khoa-moi ⇒ trang vẫn "khoa-cu" (nằm trong .next/static/chunks).
 * (3) npm audit trên next@15.2.2 ⇒ critical "Authorization Bypass in Next.js Middleware" GHSA-f82v-jwr5-mffw (>=15.0.0 <15.2.3) + 5 lỗ hổng middleware/proxy khác.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-9:file:src/app/khoa/page.tsx": "'use client';\n\nexport default function Khoa() {\n  const khoa = process.env.NEXT_PUBLIC_GIF_KEY;\n  return <p>Khoá GIF đang dùng: {khoa ?? '(trống)'}</p>;\n}\n",
 "n0-9:chuan-bi": "$ NEXT_PUBLIC_GIF_KEY=khoa-cu npm run build\nRoute (app)\n┌ ○ /\n├ ○ /_not-found\n└ ○ /khoa\n\n\n○  (Static)  prerendered as static content",
 "n0-9:public": "$ npm run start -- -p 19304\n$ curl -s -o /dev/null -w 'next.svg (có sẵn từ đầu) → %{http_code}\\n' localhost:19304/next.svg\nnext.svg (có sẵn từ đầu) → 200\n$ echo 'bài tập mới' > public/moi.txt\n$ curl -s -o /dev/null -w 'moi.txt vừa thêm → %{http_code}\\n' localhost:19304/moi.txt\nmoi.txt vừa thêm → 404\n$ ls public/\nfile.svg\nglobe.svg\nmoi.txt\nnext.svg\nvercel.svg\nwindow.svg\n# khởi động lại server (Ctrl+C rồi npm run start)\n$ curl -s -o /dev/null -w 'moi.txt sau khi khởi động lại → %{http_code}\\n' localhost:19304/moi.txt\nmoi.txt sau khi khởi động lại → 200",
 "n0-9:env": "$ NEXT_PUBLIC_GIF_KEY=khoa-moi npm run start -- -p 19304\n$ curl -s localhost:19304/khoa | grep -o 'Khoá GIF[^<]*<!-- -->[^<]*' | sed 's/<!-- -->//'\nKhoá GIF đang dùng: khoa-cu\n$ grep -rl 'khoa-cu' .next/static/chunks/ | head -2\n.next/static/chunks/03gwiic12gi_0.js",
 "n0-9:audit": "$ npm audit --json | (lọc: lỗ hổng có chữ middleware)\nmoderate  Next.js Improper Middleware Redirect Handling Leads to SSRF \n          https://github.com/advisories/GHSA-4342-x723-ch2f · ảnh hưởng >=15.0.0-canary.0 <15.4.7\ncritical  Authorization Bypass in Next.js Middleware \n          https://github.com/advisories/GHSA-f82v-jwr5-mffw · ảnh hưởng >=15.0.0 <15.2.3\nlow       Next.js's Middleware / Proxy redirects can be cache-poisoned \n          https://github.com/advisories/GHSA-3g8h-86w9-wvmq · ảnh hưởng >=12.2.0 <15.5.16\nhigh      Next.js has a Middleware / Proxy bypass in App Router applications via segment-prefetch routes \n          https://github.com/advisories/GHSA-267c-6grr-h53f · ảnh hưởng >=15.2.0 <15.5.16\nhigh      Next.js has a Middleware / Proxy bypass in Pages Router applications using i18n \n          https://github.com/advisories/GHSA-36qx-fr4f-26g5 · ảnh hưởng >=12.2.0 <15.5.16\nhigh      Next.js has a Middleware / Proxy bypass in App Router applications via segment-prefetch routes - Incomplete Fix Follow-Up \n          https://github.com/advisories/GHSA-26hh-7cqf-hhc6 · ảnh hưởng >=15.2.0 <15.5.18"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, icards, cmp, box, two, steps, kw, c, tiers, vsd, path, meter } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-00-9', code: 'NXJ 0.9', title: 'Start here (2/2) — How to learn this without drowning', sub: 'Section 0 · Start here (2/2)' };
const O = (k) => { const v = DU_LIEU[`n0-9:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s, ...lenh) => s.split('\n').filter((l) => !lenh.some((x) => l.includes(x))).join('\n');

export const S = [
  { cover: true, nhan: 'Section 0 · Start here (2/2)', t: 'How to learn this<br>without drowning', sub: 'Three real outages that "worked on my machine", the order that keeps you afloat, and a study rhythm you can keep',
    en: 'Start here, part two: how to learn this without drowning. Three real outages that worked on someone\'s machine, the learning order that keeps you afloat, and a study rhythm you can actually keep.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The order: React first, then the App Router, then shipping</li>
    <li>Three real incidents — reproduced on Next.js 16.4.6</li>
    <li>The habit they all teach: measure the real build</li>
    <li>The mindset: build alongside, read errors, finish each chapter</li>
    <li>Where AI helps — and where it quietly hurts</li>
    <li>A minimal and a full path, and a 50-minute session</li></ul>`,
    en: 'Six takeaways: the learning order; three real incidents reproduced on Next sixteen; the habit they teach, measuring the real build; the mindset; where AI helps and where it hurts; and two paths plus a fifty minute study session.' },
  { t: 'Learn in order — each stage stands on the one below', body: tiers([
      ['box', '3 · Build and ship — Chapters 13–20', 'styling, state, auth, forms, SEO, speed, tests, deploy', '#e0590b'],
      ['map', '2 · The App Router — Chapters 8–12', '"this runs on the server" only means something now', '#0070f3'],
      ['code', '1 · React — Chapters 1–7', 'components, state, effects, keys: the foundation', '#087ea4'],
    ], { th: 70 }) + box('Most first-week Next.js bugs are React bugs wearing a framework hat', `A stale closure, a missing key, an effect that re-runs, state copied from a prop. Learn the model while no framework is in the way.`, 'lam'),
    en: 'Learn in order. Stage one, React in chapters one to seven, is the foundation. Stage two, the App Router in chapters eight to twelve, only makes sense once you know what a component is. Stage three, chapters thirteen to twenty, is building and shipping. Most first-week Next bugs are React bugs wearing a framework hat: a stale closure, a missing key, an effect that re-runs.' },
  { t: 'Incident 1 — a new file in public/ returns 404 (cuongthai.com, 30 Jul 2026)', body: two(tn(bo(O('public'), '$ ls public/', 'file.svg', 'globe.svg', 'vercel.svg', 'window.svg', 'next.svg\n'), { fs: 13, wrap: 64 }),
      box('What happened on this site', 'The 3D playground was rebuilt; its JS files got new names. The running server answered 404 for files that existed on disk — no JS ran, the loading screen spun forever, and there was no error to see.', 'do2') +
      box('Why', '<code>next start</code> reads the list of files in <code>public/</code> when it STARTS. Changed public/? Restart the server. Production was safe: every deploy is a fresh container.', 'lam'), 'r64'),
    en: 'Incident one, on this very site, thirtieth of July twenty twenty six. Reproduced on sixteen point four point six: a file added to public after next start returns four oh four, and after a restart it returns two hundred. On the site, a rebuilt 3D playground spun its loading screen forever with no error at all. Next reads the public folder list when the server starts.' },
  { t: 'Incident 2 — NEXT_PUBLIC_ is baked in at BUILD time (cuongthai.com, 2 Jul 2026)', body: tsx(`'use client';   // src/app/khoa/page.tsx
export default function Khoa() {
  const khoa = process.env.NEXT_PUBLIC_GIF_KEY;
  return <p>Khoá GIF đang dùng: {khoa ?? '(trống)'}</p>;
}`, { sm: true, hl: [3] }) + two(tn(O('env'), { fs: 13, wrap: 64 }),
      box('What happened on this site', 'The GIF picker called GIPHY from the browser with a <code>NEXT_PUBLIC_</code> key; a build without it shipped a revoked fallback key.', 'do2') +
      box('Why', 'Every <code>NEXT_PUBLIC_*</code> value is copied INTO the JavaScript during <code>next build</code>. Changing it at start time does nothing (Chapter 20).', 'lam'), 'r64'),
    en: 'Incident two, second of July twenty twenty six. Built with khoa cu, started with khoa moi: the page still says khoa cu, and the value sits inside a file in dot next static chunks. Every next public variable is copied into the JavaScript at build time. On the site, a GIF picker died this way.' },
  { t: 'Incident 3 — middleware is not a wall (CVE-2025-29927, March 2025)', body: tn(O('audit'), { fs: 14, wrap: 105 }) +
    two(box('What it was', 'A request header let anyone skip middleware on Next.js 15.0.0–15.2.2 — and many apps did their auth check ONLY there. <code>npm audit</code> flags it as critical.', 'do2'),
      box('What to learn', 'Check auth again where the data is read (Chapter 15), keep Next.js patched, and run <code>npm audit</code>. The tool tells you — if you ask.', 'xanh')),
    en: 'Incident three is public: CVE twenty twenty five, twenty nine nine two seven. npm audit on Next fifteen point two point two reports a critical authorization bypass in middleware, advisory GHSA f82v, plus five more middleware and proxy issues fixed later. Many apps checked auth only in middleware. Lesson: check again where the data is read, and keep Next patched.' },
  { t: 'What all three teach: "it worked" is not evidence', body: path([{ t: 'npm run dev', s: 'green on my machine' }, { t: 'next build', s: 'what really ships', on: true }, { t: 'next start', s: 'what users hit', on: true }, { t: 'curl / DevTools', s: 'what really arrives', on: true }], { nhan: ['≠', 'serve it', 'measure'] }) +
    icards([
      ['test', 'Reproduce with build + start', 'not with dev — dev forgives what production does not'],
      ['search', 'Measure what arrives', 'curl the HTML, read the build table, open the Network tab'],
      ['eye', 'Read the whole message', 'React and Next errors usually say how to fix them'],
      ['list', 'Read the build output', 'the route table tells you what you actually shipped'],
    ], 2), to: true,
    en: 'All three teach one habit: it worked is not evidence. Dev being green on your machine is not what ships. Reproduce with build and start, measure what really arrives with curl and DevTools, and read the whole error message.' },
  { t: 'The mindset that works', body: icards([
      ['code', 'Build alongside', 'type the code, do not paste — reading feels like understanding, the keyboard reveals the truth'],
      ['warn', 'Errors are lessons', 'read the full message; it usually names the fix'],
      ['gauge', 'Measure, don\'t guess', 'build output, a curl, the profiler — before you reason'],
      ['check', 'Finish each chapter', 'quiz + Code Lab catch exactly the misconceptions this course targets'],
    ], 2), to: true,
    en: 'The mindset: build alongside — type, do not paste; treat errors as lessons and read them fully; measure before you reason; and finish each chapter with its quiz and Code Lab exercises.' },
  { t: 'A word about AI writing code for you', body: vsd(tsx(`useEffect(() => { load(id); }, []);   // missing dep: stale id
{items.map((m, i) => <Row key={i} {...m} />)} // index as key
'use client';  // at the top of a layout:
               // half the app ships to the browser`),
    `<ul><li>It compiles, it renders, it passes a quick look</li><li>It breaks quietly — later, in production</li><li>This course builds the <b>judgement</b> to spot each line on the left</li><li>Use AI to go faster where you already understand; never to skip understanding</li></ul>`,
    '✗ Plausible AI code, quietly wrong', '✓ What this course gives you'),
    en: 'A word about AI. It happily writes a component that renders but is quietly wrong: an effect with a missing dependency, an index used as a key, use client at the top of a layout that drags half the app into the browser. It compiles and ships the bug. Use AI to go faster where you already understand, never to skip understanding.' },
  { t: 'Two paths, and one study session', body: two('<div>' + cmp(['', 'Minimal path', 'Full path'], [
      ['Chapters', '1–12 + 20', 'all 20'], ['You can', 'build and deploy a working App Router app', 'run it like a team: auth, SEO, tests, speed'],
      ['Time*', '≈ 6–8 weeks', '≈ 12–14 weeks'],
    ]) + `<div class="cap">* at about five 50-minute sessions a week — a guide, not a rule</div></div>`,
    '<div>' + meter([['read the lesson', 10, '#64748b'], ['type the code', 20, '#0070f3'], ['change & break it', 10, '#e0590b'], ['quiz / Code Lab', 10, '#1f8a3b']], { don: 'min', nhan: 200, w: 440 }) + '<div class="cap">one 50-minute session</div></div>', 'r64'),
    en: 'Two paths. The minimal one, chapters one to twelve plus twenty, gets you a working App Router app you can deploy. The full one adds auth, SEO, tests and speed. At about five sessions a week that is roughly six to eight weeks, or twelve to fourteen — a guide, not a rule. One session is fifty minutes: ten to read, twenty to type, ten to change and break it, ten for the quiz or Code Lab.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Learn in order', 'React → App Router → ship'), kw('Build alongside', 'type and break code'), kw('public/', 'static files, listed at server start'),
      kw('NEXT_PUBLIC_*', 'copied into the JS at build time'), kw('middleware', 'runs before a route — not a wall'), kw('npm audit', 'known vulnerabilities in your deps'),
      kw('build + start', 'how you reproduce production'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: learn in order, build alongside, the public folder, next public variables, middleware, npm audit, and build plus start.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Write "React 1–7 before Next.js 8–20" where you will see it',
      `Create your dev app now (lesson 0.3) and promise to type, not paste`,
      `Reproduce incident 1: add a file to ${c('public/')} after ${c('npm run start')}`,
      'Find this course\'s Exam Room and Code Lab; mark where Chapter 1 lives',
    ]), box('Keep these', `<ul><li>Order: React → App Router → ship</li><li>Measure the real build</li><li>NEXT_PUBLIC_ = build time</li><li>AI for speed, not for understanding</li></ul>`, 'lam'), ''),
    en: 'Your turn: commit to the order; create your dev app and type rather than paste; reproduce incident one yourself; and find the Exam Room and Code Lab for chapter one. Keep: learn in order, measure the real build, next public variables are fixed at build time, and AI is for speed, not for understanding.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: 'Start here 2' }, S);
