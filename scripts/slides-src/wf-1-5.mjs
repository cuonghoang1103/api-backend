/** Web Foundations · deck bài 1.5 — Node & npm. Output thật: Node 22.23 + npm 10.9, cài thật từ registry (_demo/_t1/npm/chay.sh). */
import { deckWf, js, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const dong = (k, a, b) => OUT[k].split('\n').slice(a, b).join('\n');

export const deck = { key: 'wf-1-5', code: 'WF 1.5', title: 'Node and npm', sub: 'Web Foundations · Chapter 1' };

export const slides = deckWf({ chuong: 'Chapter 1 — Your toolbox', bai: '1.5' }, [
  { cover: true, t: 'Node and npm', sub: 'Running JavaScript and installing libraries' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Run JavaScript with <b>node</b></li>
    <li>Create <b>package.json</b></li>
    <li>Install <b>dependencies</b> and <b>devDependencies</b></li>
    <li>Read <b>^ and ~</b> and the <b>lock file</b></li>
    <li>Use <b>scripts</b> and <b>npm ci</b></li></ul>` },

  { t: 'Node runs JavaScript', giua: true, body: term('_t1/npm/out/node', null, { title: 'node -e' }) + js('_t1/npm/index.js', null, { gon: true }) },

  { t: 'package.json and the first install', giua: true, body: term(null, dong('_t1/npm/out/install', 0, 6) + '\n…\n' + dong('_t1/npm/out/install', -16, undefined), { title: 'before and after npm install' }) },

  { t: 'Dev dependencies multiply', giua: true, body: term(null, dong('_t1/npm/out/devdeps', 0, 5) + '\n' + dong('_t1/npm/out/devdeps', 10, undefined), { title: 'npm install -D nodemon' }) + box('1 tool → 29 packages', 'transitive dependencies — never commit node_modules', 'info') },

  { t: 'The lock file and version ranges', giua: true, body: term('_t1/npm/out/lock', null, { title: 'package-lock.json · semver' }) },

  { t: 'Scripts', giua: true, body: term(null, dong('_t1/npm/out/scripts', 0, 15), { title: 'npm run · npm start' }) + tbl(['script', 'run with'], [['start', 'npm start'], ['dev', 'npm run dev'], ['test', 'npm test']]) },

  { t: 'Reinstall exactly: npm ci', giua: true, body: steps(['git clone — code + lock file', 'npm ci — exact versions', 'cp .env.example .env', 'npm run dev']) + two(box('Commit', 'package.json + package-lock.json', 'ok'), box('Never commit', 'node_modules/', 'bad')) },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>node file.js</li>
    <li>npm install / -D</li>
    <li>^ major · ~ minor</li>
    <li>npm start · test · run dev</li>
    <li>npm ci from the lock</li></ul>`,
    box('Practice (40 min)', 'Make portfolio an npm project: dayjs, nodemon, start/dev/test scripts, delete node_modules, npm ci.<br><br><b>Done when</b>: npm test passes and node_modules is not in git status.', 'ok')) },
]);
