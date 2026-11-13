/**
 * nxj-00-3 — Next.js · Section 0 · Lesson 0.3 "Installation & the dev loop" (deck video + web, 13/11/2026).
 * Bài web: nextjs-0-3-cai-dat. Output THẬT (scratchpad/nxj/demo/n0-3.txt · Mac · Node 22.23.3 · npm 10.9.9):
 * `npx create-next-app@latest my-app` (= 16.4.6) chạy TƯƠNG TÁC qua expect, transcript làm sạch bằng cna-sach.py — câu đầu "recommended defaults?"
 * (mặc định: KHÔNG src/, Cache Components BẬT); khoá này chọn "No, customize settings", src/ = Yes, Cache Components = No.
 * `npm run dev` ⇒ "▲ Next.js 16.4.6 (Turbopack)", tự sinh AGENTS.md (agentRules); Fast Refresh (Playwright): bấm 3 lần ⇒ sửa + lưu page.tsx ⇒
 * chữ đổi, số đếm VẪN 3. Thêm src/app/about/page.tsx ⇒ /about 200. `npm run build` ⇒ bảng route ○ / · ○ /_not-found · ○ /about + chạy TypeScript.
 * Đường dẫn "Tài liệu/my app": Next.js build ĐƯỢC; script quên dấu nháy ⇒ "cd: ~/lab/Tài: No such file or directory".
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-3:tao": "$ npx create-next-app@latest my-app\n✔ Would you like to use the recommended Next.js defaults? › No, customize settings\n✔ Would you like to use TypeScript? … Yes\n✔ Which linter would you like to use? › ESLint\n✔ Would you like to use React Compiler? … No\n✔ Would you like to use Tailwind CSS? … Yes\n✔ Would you like your code inside a `src/` directory? … Yes\n✔ Would you like to use App Router? (recommended) … Yes\n✔ Would you like to use Cache Components? … No\n✔ Would you like to customize the import alias (`@/*` by default)? … No\n✔ Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? … No\n✔ Would you like to help improve Next.js by letting agents prepare anonymized feedback for your review as you code? (Disable anytime with `experimental.agentFeedback: false`.) … No\nCreating a new Next.js app in /Users/admin/.rtq-nxj/lab/my-app.\nUsing npm.\nInitializing project with template: app-tw\nInstalling dependencies:\n- next\n- react\n- react-dom\nInstalling devDependencies:\n- @tailwindcss/turbopack\n- @types/node\n- @types/react\n- @types/react-dom\n- eslint\n- eslint-config-next\n- tailwindcss\n- typescript\nnpm warn deprecated eslint@9.39.5: This version is no longer supported. Please see https://eslint.org/version-support for other options.\nadded 360 packages, and audited 361 packages in 19s\n146 packages are looking for funding\n  run `npm fund` for details\n8 moderate severity vulnerabilities\nTo address issues that do not require attention, run:\n  npm audit fix\nTo address all issues (including breaking changes), run:\n  npm audit fix --force\nRun `npm audit` for details.\nGenerating route types...\n✓ Types generated successfully\nInitialized a git repository.\nSuccess! Created my-app at /Users/admin/.rtq-nxj/lab/my-app",
 "n0-3:node": "$ node --version\nv22.23.3\n$ npm --version\n10.9.9",
 "n0-3:cay": "$ ls\neslint.config.mjs\nnext-env.d.ts\nnext.config.ts\nnode_modules\npackage-lock.json\npackage.json\npublic\nREADME.md\nsrc\ntsconfig.json\n$ ls src/app\nfavicon.ico\nglobals.css\nlayout.tsx\npage.tsx\n$ cat src/app/page.tsx | head -12\nimport Image from \"next/image\";\n\nexport default function Home() {\n  return (\n    <div className=\"flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black\">\n      <main className=\"flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start\">\n        <Image\n          className=\"dark:invert h-5 w-[100px]\"\n          src=\"/next.svg\"\n          alt=\"Next.js logo\"\n          width={100}\n          height={20}",
 "n0-3:file:src/app/dem.tsx": "'use client';\nimport { useState } from 'react';\n\nexport default function Dem() {\n  const [n, setN] = useState(0);\n  return (\n    <button className=\"rounded bg-black px-4 py-2 text-white\" onClick={() => setN(n + 1)}>\n      Đã bấm: {n} lần\n    </button>\n  );\n}\n",
 "n0-3:file:src/app/page.tsx": "import Dem from './dem';\n\nexport default function Home() {\n  return (\n    <main className=\"p-10 font-sans\">\n      <h1 className=\"text-3xl font-bold\">Xin chào Next.js</h1>\n      <p className=\"my-4\">Sửa tệp này, lưu, và xem trình duyệt.</p>\n      <Dem />\n    </main>\n  );\n}\n",
 "n0-3:dev": "$ npm run dev -- -p 19306\n$ curl -s -o /dev/null -w 'GET / → %{http_code}\\n' localhost:19306/\nGET / → 200\n▲ Next.js 16.4.6 (Turbopack)\n- Local:         http://127.0.0.1:19306\n- Network:       http://127.0.0.1:19306\n✓ Ready in 332ms\n\n✓ Running next.config.ts took 1251ms\n\n✓ Generated AGENTS.md for AI agents. Set `agentRules: false` in next.config to disable.\n GET / 200 in 219ms (next.js: 125ms, application-code: 94ms)",
 "n0-3:file:src/app/about/page.tsx": "export default function About() {\n  return <h1 className=\"p-10 text-3xl font-bold\">Trang giới thiệu</h1>;\n}\n",
 "n0-3:about": "$ curl -s -o /dev/null -w 'GET /about → %{http_code}\\n' localhost:19306/about\nGET /about → 200",
 "n0-3:dung-dev": "",
 "n0-3:build": "$ npm run build\n\n> my-app@0.1.0 build\n> next build\n\n▲ Next.js 16.4.6 (Turbopack)\n✓ Running next.config.ts took 20ms\n\n  Creating an optimized production build ...\n✓ Compiled successfully in 2.4s\n  Running TypeScript ...\n  Finished TypeScript in 1083ms ...\n  Collecting page data using 6 workers ...\n  Generating static pages using 6 workers (0/5) ...\n  Generating static pages using 6 workers (1/5) \n  Generating static pages using 6 workers (2/5) \n  Generating static pages using 6 workers (3/5) \n✓ Generating static pages using 6 workers (5/5) in 331ms\n  Finalizing page optimization ...\n\nRoute (app)\n┌ ○ /\n├ ○ /_not-found\n└ ○ /about\n\n\n○  (Static)  prerendered as static content",
 "n0-3:start": "$ npm run start -- -p 19307\n▲ Next.js 16.4.6\n- Local:         http://127.0.0.1:19307\n- Network:       http://127.0.0.1:19307\n✓ Ready in 94ms\n\n✓ Running next.config.ts took 23ms\n$ curl -s -o /dev/null -w 'GET /about → %{http_code}\\n' localhost:19307/about\nGET /about → 200",
 "n0-3:duong-dan": "$ cd \"Tài liệu/my app\" && npm run build 2>&1 | tail -7\nRoute (app)\n┌ ○ /\n└ ○ /_not-found\n\n\n○  (Static)  prerendered as static content\n$ DIR=\"$HOME/lab/Tài liệu/my app\"; cd $DIR    # quên dấu nháy\nbash: line 0: cd: ~/lab/Tài: No such file or directory\n$ cd \"$DIR\" && pwd    # có dấu nháy\n~/lab/Tài liệu/my app"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, tree, icards, cmp, box, two, steps, kw, c } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-00-3', code: 'NXJ 0.3', title: 'Installation & the dev loop', sub: 'Section 0 · Lesson 0.3' };
const O = (k) => { const v = DU_LIEU[`n0-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const B = (ten, o) => br('nxj-00-3', ten, { vp: 640, ...o });
const L = (k, a, b) => O(k).split('\n').slice(a, b).join('\n');
/** bỏ các dòng tiến độ lặp lại / lời nhắc npm (không đổi chữ của các dòng còn lại) */
const gon = (t, ...bo) => t.split('\n').filter((l) => !bo.some((r) => r.test(l))).join('\n');

export const S = [
  { cover: true, nhan: 'Section 0 · Lesson 0.3', t: 'Installation<br>&amp; the dev loop', sub: 'Node 22, create-next-app 16.4.6 question by question, Fast Refresh, and the three commands you must not confuse',
    en: 'Lesson zero point three: install once, then live in the dev loop. Node twenty two, create-next-app answered question by question, Fast Refresh, and the three commands you must not confuse.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Node.js 22 LTS — and pinning it with <code>.nvmrc</code></li>
    <li>Every question <code>create-next-app</code> 16.4.6 asks — and the answers for this course</li>
    <li>What the scaffold creates, file by file</li>
    <li>The dev server and Fast Refresh, seen in a real browser</li>
    <li>dev vs build vs start — and why the build is the truth</li>
    <li>The path trap, measured</li></ul>`,
    en: 'Six takeaways: Node twenty two and dot nvmrc; every question create-next-app asks and our answers; what the scaffold creates; the dev server and Fast Refresh in a real browser; dev versus build versus start; and the path trap, measured.' },
  { t: '1 · Node.js 22 LTS', body: two(tn(O('node'), { fs: 18 }), icards([
      ['check', 'LTS = long-term support', 'the version you install on a laptop or server; 22.x at the time of writing'],
      ['loop', 'nvm + .nvmrc', 'several projects, several Node versions: write <code>22</code> in <code>.nvmrc</code>, run <code>nvm use</code>'],
      ['warn', 'Too old a Node', 'Next.js has a minimum; below it you get syntax errors inside the library that look like your fault'],
    ], 1), 'r46'),
    en: 'Step one: Node twenty two LTS, long-term support. Check with node dash dash version — this course runs on twenty two point twenty three point three. If you juggle projects on different versions, use nvm and put the version in a dot nvmrc file. Below Next.js\'s minimum, you get syntax errors inside the library that look like your mistake.' },
  { t: '2 · create-next-app 16.4.6 — every question, answered for this course', body: tn(L('tao', 0, 12), { fs: 13, wrap: 118 }) +
    box('Do not just press Enter', 'The recommended defaults put code outside <code>src/</code> and turn <b>Cache Components ON</b>. This course teaches the classic cache model first (Chapter 10) ⇒ choose <b>No, customize settings</b>, then <b>src/ = Yes</b> and <b>Cache Components = No</b>.', 'cam'),
    en: 'Step two: npx create-next-app at latest, which is sixteen point four point six today. This is the real interactive run. The first question offers recommended defaults — those keep code outside src and switch Cache Components on. This course teaches the classic cache model first, so choose No, customize settings: TypeScript yes, ESLint, React Compiler no, Tailwind yes, src directory yes, App Router yes, Cache Components no, default import alias.' },
  { t: 'What it installs — and what lands on disk', body: two(tn(gon(L('tao', 12, 40), /^npm warn/, /funding|npm fund|vulnerabilit|npm audit|address|^Run |^\s*$/), { fs: 13, wrap: 70 }), tree([
      'my-app/', '  src/app/', '*    layout.tsx     // wraps every page', '*    page.tsx       // the route "/"', '    globals.css    // global styles + Tailwind', '    favicon.ico',
      '  public/          // static files, served as-is', '  next.config.ts   // framework config', '  package.json', '  tsconfig.json', '  eslint.config.mjs',
    ], { fs: 16 }), 'r64'),
    en: 'What it installs: next, react and react-dom, plus Tailwind for Turbopack, TypeScript types and ESLint — three hundred sixty packages. On disk: src slash app with layout dot tsx, which wraps every page, page dot tsx, the route slash, and globals dot css; public for static files; next dot config dot ts; package dot json and tsconfig.' },
  { t: '3 · npm run dev — and Fast Refresh in a real browser', body: two(tn(gon(L('dev', 0, 12), /^\s*$/), { fs: 13, wrap: 58 }),
      `<div>${B('fr-truoc', { url: 'localhost:3000 · before saving', h: 190, w: 440, mark: [[40, 132, 133, 40, '']] })}<div class="cap" style="text-align:center">edit the heading in page.tsx, save…</div>${B('dev-dau', { url: 'localhost:3000 · after saving', h: 190, w: 440, mark: [[40, 40, 420, 36, 'new text'], [40, 132, 133, 40, '']] })}</div>`, 'r64'),
    en: 'Step three: npm run dev. Next sixteen point four point six starts with Turbopack, ready in well under a second on the course machine — and it generated an AGENTS dot md for AI agents even though we said no. Fast Refresh, in a real browser: we clicked the counter three times, edited the heading and saved. The text changed without a reload, and the count is still three — state survives the edit.' },
  { t: 'A folder under app/ is a URL segment', body: two(tree(['src/app/', '  layout.tsx', '  page.tsx        // "/"', '*  about/', '*    page.tsx      // "/about"'], { fs: 19 }) + tn(O('about'), { fs: 13, wrap: 46 }),
      B('about', { url: 'localhost:3000/about', h: 200, w: 480 }), 'r64'),
    en: 'The rule you will use a hundred times: a folder under app is a URL segment, and the page dot tsx inside it is the page at that URL. We created about slash page dot tsx — no router configuration — and slash about answered two hundred. Chapter eight takes this apart in full.' },
  { t: 'Three commands you must not confuse', body: cmp(['', 'What it is', 'Who sees it'], [
      ['<code>npm run dev</code>', 'Fast Refresh, detailed errors, source maps — slow, not minified', 'only you'],
      ['<code>npm run build</code>', 'optimised output in <code>.next/</code>: minified bundles, pre-rendered pages, a TypeScript check', 'nobody yet'],
      ['<code>npm run start</code>', 'serves what build produced — this IS production', 'your users'],
    ]) + box('Dev lies — sometimes helpfully, sometimes not', 'Code that works in dev can fail in build (a type error, a Server/Client boundary) and the reverse. When behaviour surprises you near a deploy, reproduce with <code>npm run build &amp;&amp; npm run start</code>.', 'cam'),
    en: 'Three commands you must not confuse. npm run dev: Fast Refresh, detailed errors, slow and unminified — only you see it. npm run build: the optimised output in dot next, pre-rendered pages and a TypeScript check. npm run start: serves what build produced — this is production. Dev lies, sometimes helpfully: when something surprises you near a deploy, reproduce it with build and start.' },
  { t: '4 · npm run build, then npm run start', body: two(tn(gon(L('build', 4, 99), /Generating static pages using \d+ workers \(\d\/\d\)/, /^\s*$/), { fs: 13, wrap: 64 }), tn(gon(O('start'), /^\s*$/), { fs: 13, wrap: 60 }) + box('Read the route table', '<b>○ Static</b>: pre-rendered at build time. Chapter 17 adds <b>ƒ Dynamic</b> (rendered per request). The build also ran TypeScript over the whole project.', 'lam'), ''),
    en: 'Step four: npm run build. It compiles, runs TypeScript over the whole project, generates static pages, and prints the route table: slash, not-found and slash about, all marked with a circle — static, pre-rendered at build time. Then npm run start serves exactly that, and slash about answers two hundred.' },
  { t: 'Trap: a path with spaces or non-ASCII characters', body: tn(O('duong-dan'), { fs: 15, wrap: 100 }) +
    two(box('What really happened (Next.js 16.4.6)', 'Next.js itself built fine inside <code>Tài liệu/my app</code>. The script that forgot quotes broke: <code>cd $DIR</code> split the path at the space.', 'do2'),
      box('Five-second decision', 'Keep project paths ASCII with no spaces. Every tool in the chain — scripts, Docker mounts, CI — then has one less way to fail.', 'xanh')),
    en: 'The trap: a project inside a path with a space or Vietnamese characters. Measured: Next sixteen built fine inside Tài liệu slash my app. What broke was a shell script that forgot quotes — cd dollar DIR split the path at the space. With quotes it works. Keep project paths ASCII with no spaces: a five-second decision that removes a whole family of strange failures.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Node.js LTS', '22.x — the runtime Next.js runs on'), kw('create-next-app', 'the official scaffolder'), kw('Fast Refresh', 'updates on save, keeps component state'),
      kw('npm run dev', 'development server, never what users hit'), kw('build / start', 'make the production output / serve it'), kw('app/ routing', 'a folder = a URL segment'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: Node LTS, create-next-app, Fast Refresh, npm run dev, build and start, and app routing — a folder is a URL segment.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `${c('node --version')} → 22.x (or switch with nvm)`,
      `${c('npx create-next-app@latest my-app')}: customize · src/ Yes · Cache Components No`,
      `${c('npm run dev')}: change a word in page.tsx, watch Fast Refresh; add ${c('app/about/page.tsx')}`,
      `${c('npm run build')} once — read the route table`,
    ]), box('Keep these', `<ul><li>Node 22 LTS, then create-next-app</li><li>dev ≠ build ≠ start</li><li>Near a deploy, trust build + start</li><li>A folder under app/ is a URL</li></ul>`, 'lam'), ''),
    en: 'Your turn: check Node twenty two; scaffold with create-next-app, customizing — src yes, Cache Components no; run dev, change a word and watch Fast Refresh, add an about page; run build once and read the route table. Keep: Node then create-next-app; dev, build and start are different; near a deploy trust build and start; a folder under app is a URL.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: '0.3' }, S);
