/**
 * node-04-1 — Node.js · Chapter 4 · Lesson 4.1 "package.json and npm scripts" (slide EN, kiểu FU, đợt 3 — 01/11/2026).
 * Nguồn: content/courses/nodejs/s04-npm.mjs › nodejs-4-1-package-json. Mọi output THẬT: npm 10.9.9 của Node 22.23.3 chạy trong thư mục tạm
 * (src/khung/node/that/c4/{init,watch,deps,cmds}). Bổ sung so với bài web: node --watch chạy thật, npm ci --omit=dev đếm 66 → 65 gói,
 * cú sập production (express lỡ nằm ở devDependencies ⇒ ERR_MODULE_NOT_FOUND) chạy thật, PATH của script (prettier: command not found / npx).
 */
import { lamDeck, two, box, kw, bang, cards, flow, ma, ra, js, term, cot } from './_node-chung.mjs';

export const deck = { key: 'node-04-1', code: 'NODE 4.1', title: 'package.json and npm scripts', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a';
/** Ngắt dòng output dài như một terminal hẹp (không đổi chữ): dòng > n ký tự ⇒ xuống dòng ở dấu cách gần nhất, thụt 2. */
const gay = (t, n = 56) => t.split('\n').flatMap((l) => { const o = []; let r = l; while (r.length > n) { let k = r.lastIndexOf(' ', n); if (k < 20) k = n; o.push(r.slice(0, k)); r = '  ' + r.slice(k).trimStart(); } o.push(r); return o; }).join('\n');
const bo = (t) => t.split('\n').filter((l) => !/fund|^$/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 4 — npm and a Clean Project', bai: '4.1' }, [
  { cover: true, t: 'package.json<br>and npm scripts', sub: 'One file defines your project. Get it right and anyone can run it with two commands.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What <code class="i">npm init -y</code> writes, and the <b>two fields</b> every backend adds at once</li>
<li><b>dependencies</b> vs <b>devDependencies</b>, and the production crash that lives between them</li>
<li><b>npm scripts</b>: the project's own command list</li>
<li>The npm commands you will type every day</li>
</ul>
<div style="display:flex;gap:12px;flex-wrap:wrap">${kw('npm', 'Node Package Manager: installs packages, runs scripts')} ${kw('package', 'a folder of code with its own package.json')}</div>
${box('The promise', 'Clone the repo, run <code class="i">npm ci</code> then <code class="i">npm start</code>. Two commands, on any machine.', 'xanh')}` },

  { t: 'Picture a recipe card', to: true, giua: true, body: `${flow([
    { t: 'Dish name', s: 'name + version', mau: CAM },
    { t: 'Ingredients', s: 'dependencies', mau: NODE },
    { t: 'Kitchen tools', s: 'devDependencies', mau: LAM },
    { t: 'Steps', s: 'scripts', mau: DO },
  ], { h: 170, fs: 24 })}
<ul>
<li>Guests eat the <b>ingredients</b>; they never see the <b>knife</b> you used</li>
<li>Anyone holding the card can cook the same dish, <b>step by step</b></li>
<li>The card also says which <b>oven</b> it needs: that is <code class="i">engines</code></li>
</ul>
${box('Mapping', 'package.json is the recipe card of your project. A new teammate needs it, and nothing else, to start.', 'xanh')}` },

  { t: 'npm init -y: the skeleton', giua: true, body: two(term(ra('c4/init', 1, 15), { title: 'terminal · npm 10.9.9 (Node 22)', hl: [5, 6, 8, 10] }), cot(
    box('-y', 'Answer "yes" to every question and write the defaults.', 'lam'),
    box('name, version', 'Taken from the folder name, starting at 1.0.0.', ''),
    box('main, test', '<code class="i">main</code> matters for libraries. The default <code class="i">test</code> script just fails on purpose.', ''),
    box('Missing for a backend', 'The module system and the Node version. Next slide.', 'do2')), 'r64') },

  { t: 'A backend-ready package.json', giua: true, body: two(js(`{
  "name": "notes-api",
  "version": "1.0.0",
  "type": "module",               // ESM, lesson 1.5
  "engines": { "node": ">=22" },  // the Node it needs
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js",
    "test": "node --test",
    "lint": "eslint src"
  }
}`, { hl: [4, 5], sm: true }), cot(
    box('"type": "module"', 'Every <code class="i">.js</code> file is an ES module: <code class="i">import</code> / <code class="i">export</code>.', 'lam'),
    box('"engines"', 'The Node version. Some hosts enforce it, others only warn.', ''),
    box('"scripts"', 'Named commands: dev, start, test, lint.', 'xanh'),
    `<div class="nho">Comments only on this slide: real JSON allows none.</div>`), 'r64') },

  { t: 'Run the scripts for real', giua: true, body: two(term(ra('c4/init', 16, 27), { title: 'npm start = npm run start', hl: [3, 4, 6] }), term(ra('c4/init', 28, 42), { title: 'npm test → node --test', hl: [3, 4, 8] })) +
    box('Read it', 'npm prints the script name and the real command (<code class="i">&gt; node src/index.js</code>), then runs it. No test files yet, so the runner reports 0 tests.', 'xanh') },

  { t: 'node --watch: restart on save, built in', to: true, giua: true, body: two(term(ra('c4/watch'), { title: 'npm run dev · real session', hl: [8, 9] }), cot(
    box('What happened', 'Node watched the file. We saved, Node restarted the server by itself.', 'xanh'),
    box('Built in since Node 18', 'You no longer need the <code class="i">nodemon</code> package for this. One dependency fewer is one dependency fewer.', 'lam'))) + flow([
    { t: 'You save', s: 'src/index.js', mau: CAM }, { t: 'Node notices', s: 'it watches the file', mau: LAM }, { t: 'Restart', s: 'old process stops', mau: DO }, { t: 'New code runs', s: 'version 2', mau: NODE }], { h: 150, fs: 22 }) },

  { t: 'dependencies vs devDependencies', giua: true, body: two(cot(term(gay(bo(ra('c4/deps', 1, 16)), 42), { title: 'terminal', hl: [1, 5] }), term(ra('c4/deps', 18, 25), { title: 'package.json after the two installs', hl: [3, 6] })), cot(
    box('dependencies', 'Imported by code that runs in production: <b>express</b>, Prisma client, bcrypt.', 'xanh'),
    box('devDependencies (-D)', 'Tools that never run in production: <b>eslint, prettier</b>, test runners, TypeScript, build tools.', 'lam'),
    box('Why it matters', 'A Docker image installs with <code class="i">--omit=dev</code>: smaller, faster, less attack surface.', '')), 'r46') },

  { t: 'What a Docker image installs', to: true, giua: true, body: two(term(gay(bo(ra('c4/deps', 43, 61)), 48), { title: 'npm ci --omit=dev', hl: [5, 7, 12] }), cot(
    box('66 → 65', 'The dev tool is gone: <code class="i">node_modules/prettier</code> does not exist.', 'lam'),
    box('The app still runs', 'Because everything <code class="i">src/</code> imports is in dependencies.', 'xanh'))) + flow([
    { t: 'Your laptop', s: 'npm install: 66 packages', mau: LAM }, { t: 'Docker image', s: 'npm ci --omit=dev: 65', mau: NODE }, { t: 'Production', s: 'no dev tools inside', mau: CAM }], { h: 140, fs: 22 }) },

  { t: 'The classic production crash', giua: true, body: two(term(gay([ra('c4/deps', 63, 64), ra('c4/deps', 72, 72), ra('c4/deps', 74, 74), ra('c4/deps', 77, 77), '...', ra('c4/deps', 86, 86), ra('c4/deps', 98, 99)].join('\n'), 50), { title: 'express saved as a devDependency (abridged)', hl: [6, 7, 8, 9, 10] }), cot(
    box('On your laptop', 'Everything is installed, so it works.', 'xanh'),
    box('On the server', '<code class="i">--omit=dev</code> skips it: the app dies with <b>ERR_MODULE_NOT_FOUND</b>, and only <b>after</b> deploy.', 'do2'),
    box('Pocket rule', 'If <code class="i">src/</code> imports it, it belongs in <b>dependencies</b>.', '')), 'r64') + flow([
    { t: 'npm i -D express', s: 'the mistake', mau: DO }, { t: 'Laptop: works', s: 'all installed', mau: NODE }, { t: 'CI build: green', s: 'nothing imports at build', mau: NODE }, { t: 'Server: crash', s: 'ERR_MODULE_NOT_FOUND', mau: DO }], { h: 140, fs: 20 }) },

  { t: 'npm scripts: the project\'s command list', giua: true, body: two(term([...ra('c4/deps', 28, 33).split('\n'), '...', ...ra('c4/deps', 37, 41).split('\n')].join('\n'), { title: 'terminal', hl: [4, 8, 9, 11] }), cot(
    box('Always have dev / start / test', 'Even if test runs one file. A newcomer never asks "how do I run this?".', 'xanh'),
    box('Package binaries are on PATH', 'Inside a script, npm adds <code class="i">node_modules/.bin</code> to PATH, so <code class="i">prettier</code> just works.', 'lam'),
    box('Outside a script', 'Your shell does not know it: <b>command not found</b>. Use <code class="i">npx prettier</code>.', '')), 'r46') + box('Scripts are documentation', 'A newcomer reads <code class="i">"scripts"</code> and knows how to develop, start, test and lint the project, without asking anyone.', 'lam') },

  { t: 'npm commands you will type every day', giua: true, body: two(bang(['Command', 'What it does'], [
    ['<code class="i">npm i &lt;pkg&gt;</code>', 'install, write to dependencies'],
    ['<code class="i">npm i -D &lt;pkg&gt;</code>', 'install as a devDependency'],
    ['<code class="i">npm un &lt;pkg&gt;</code>', 'uninstall'],
    ['<code class="i">npm ls &lt;pkg&gt;</code>', 'why is this here? print the tree'],
    ['<code class="i">npm outdated</code>', 'which packages have newer versions'],
    ['<code class="i">npm view &lt;pkg&gt; versions</code>', 'every published version'],
    ['<code class="i">npx &lt;tool&gt;</code>', 'run a tool without a global install'],
  ], { co: 20 }), cot(term(ra('c4/cmds', 4, 13), { title: 'npm ls debug · who pulled it in?', hl: [3, 6] }), term(ra('c4/cmds', 14, 16).replace(/ {2}Location +Depended by|  node_modules\/express  notes-api/g, ''), { title: 'npm outdated (old express 4.18.0, columns trimmed)', hl: [3] })), 'r46') },

  { t: 'Pin the Node version in three places', to: true, giua: true, body: `${flow([
    { t: 'package.json', s: 'engines: >=22', mau: NODE },
    { t: 'Dockerfile', s: 'FROM node:22-alpine', mau: LAM },
    { t: 'CI workflow', s: 'node-version: 22', mau: CAM },
  ], { h: 160, fs: 24 })}
${box('This website does exactly this', 'All three must agree. When they drift, code works on your laptop and breaks <b>after</b> deploy: the most expensive kind of bug, because users find it first.', 'do2')}
${box('Habit', 'Changing Node version? Change all three in the same commit.', 'xanh')}` },

  { t: 'The fields that actually change behaviour', giua: true, body: two(js(`{
  "name": "notes-api",            // 1
  "version": "1.0.0",             // 1
  "type": "module",               // 2
  "dependencies": {               // 3
    "express": "^5.3.0"
  },
  "devDependencies": {            // 3
    "prettier": "^3.9.10"
  },
  "scripts": { "start": "..." },  // 4
  "engines": { "node": ">=22" }   // 4
}`), cot(
    box('1 · name and version', 'Identity. npm publish refuses to reuse a version.', ''),
    box('2 · type', '"module" or absent: ESM or CommonJS for every .js file.', 'lam'),
    box('3 · dependencies vs devDependencies', 'Only dependencies survive --omit=dev. A wrong place breaks the production image, not the build.', 'do2'),
    box('4 · scripts and engines', 'The project\'s command line, and the Node it needs.', 'xanh')), 'r46') },

  { t: 'Exercise: what does each command print?', giua: true, body: two(`<div style="font-size:24px">The project has <code class="i">start</code> and <code class="i">test</code> scripts, and nothing called <code class="i">nothing</code>.<br><br>What do these print?<ol><li><code class="i">npm start</code></li><li><code class="i">npm run nothing</code></li></ol></div>`,
    `<div data-k="dapan">${term(ra('c4/init', 16, 21), { title: '1 · npm start' })}${term(ra('c4/init', 43, 47), { title: '2 · npm run nothing' })}</div>`) +
    box('Why', '"start" and "test" work without the word <code class="i">run</code>. An unknown name is an error that lists where to look.', 'xanh') },

  { t: 'Check yourself + summary', giua: true, body: `
<ol>
<li>A package that <code class="i">src/</code> imports was installed with <code class="i">-D</code>. Where does it break?</li>
<li>Why can a script call <code class="i">prettier</code> directly, while your shell cannot?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Only in production, after <code class="i">npm ci --omit=dev</code>: ERR_MODULE_NOT_FOUND. &nbsp; 2. npm puts <code class="i">node_modules/.bin</code> on PATH for scripts.', 'xanh')}</div>
<ul>
<li>package.json = what the project is, needs, and how to run it</li>
<li>Add <code class="i">type</code> + <code class="i">engines</code> at once; keep dev / start / test</li>
<li>If <code class="i">src/</code> imports it, it goes in dependencies</li>
</ul>
${box('Next', 'Lesson 4.2: semver and the lockfile, or why "it works on my machine".', 'lam')}` },
]);
