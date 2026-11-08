/**
 * node-04-3 — Node.js · Chapter 4 · Lesson 4.3 "Supply chain safety" (slide EN, kiểu FU, đợt 3 — 01/11/2026).
 * Nguồn: content/courses/nodejs/s04-npm.mjs › nodejs-4-3-bao-mat-npm. Output THẬT npm 10.9.9 / Node 22.23.3 (src/khung/node/that/c4/{supply,postinstall,audit}).
 * Số đo 01/11/2026: express@4 (4.22.3) ⇒ added 68 packages, 67 thư mục trong node_modules, 4.0M, express tự khai 31 phụ thuộc; express@5 ⇒ 65, 3.8M, 28.
 * postinstall chạy thật trong một HOME TẠM (không đụng HOME thật), chỉ ghi một tệp + ĐẾM biến môi trường (91), không in tên/giá trị.
 * npm audit trên express 4.18.0: 7 vulnerabilities (3 low, 1 moderate, 3 high) — trùng bài web. Typosquatting: CHỈ npm view (không cài): expres / lodahs / crossenv.
 */
import { lamDeck, two, box, kw, bang, cards, flow, steps, ra, js, term, cot } from './_node-chung.mjs';

export const deck = { key: 'node-04-3', code: 'NODE 4.3', title: 'Supply chain safety', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a';
const gay = (t, n = 56) => t.split('\n').flatMap((l) => { const o = []; let r = l; while (r.length > n) { let k = r.lastIndexOf(' ', n); if (k < 20) k = n; o.push(r.slice(0, k)); r = '  ' + r.slice(k).trimStart(); } o.push(r); return o; }).join('\n');
const deps4 = ra('c4/supply', 36, 36).split(': ')[1].split(' ');
const chip = (t) => `<span style="display:inline-block;border:2px solid #c9dbec;background:#eef4fa;border-radius:8px;padding:3px 10px;margin:4px;font-family:Menlo,monospace;font-size:20px;color:#245077">${t}</span>`;

export const slides = lamDeck({ chuong: 'Chapter 4 — npm and a Clean Project', bai: '4.3' }, [
  { cover: true, t: 'Supply chain<br>safety', sub: 'You review your own code. How much of what runs in production did you actually write?' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Count it: <b>one</b> dependency you approve, <b>sixty-eight</b> packages you get</li>
<li>Installing runs code <b>before you import anything</b>: proved with a harmless package</li>
<li>Pinning gives reproducibility, <b>not immunity</b>: npm audit on a pinned Express</li>
<li>A checklist before adding a dependency, and how to <b>shrink the blast radius</b></li>
</ul>
<div style="display:flex;gap:12px;flex-wrap:wrap">${kw('supply chain', 'every package, and every person, between the registry and your server')} ${kw('lifecycle script', 'a command npm runs by itself, e.g. postinstall')}</div>
${box('Why a backend developer must care', 'Your server holds the database password, the payment keys and your users\' data. Every package you install runs with exactly the same rights.', 'do2')}` },

  { t: 'Picture a restaurant kitchen', to: true, giua: true, body: cards([
    ['🧑‍🍳 You approve one supplier', 'A trusted wholesaler with a good name: express.'],
    ['📦 The delivery has 68 boxes', 'Your wholesaler buys from dozens of smaller suppliers you never met.'],
    ['⚠️ One bad box', 'Any of them can slip something into the next delivery. It lands in your kitchen automatically.'],
  ], 3) + box('Mapping', 'Supplier = a package. The boxes = its dependencies, and theirs. The next delivery = your next <code class="i">npm install</code>.', 'xanh') + box('So', 'Reviewing your own code carefully is necessary. It is not sufficient.', 'do2') },

  { t: 'One dependency, sixty-eight packages', giua: true, body: two(term(gay(ra('c4/supply', 1, 11), 34), { title: 'npm i express@4 · empty folder', hl: [3, 4, 6, 8, 10] }), cot(
    box('You declared', '<b>1</b> dependency.', 'xanh'),
    box('You installed', '<b>68</b> packages (67 folders at the top of node_modules, one nested), 4.0 MB.', 'do2'),
    box('Express 5', 'Same count for Express 5: 65 packages, 3.8 MB.', 'lam'),
    box('Who wrote them?', 'Dozens of people you never met. Any of them can publish an update that lands in your next build.', ''))) },

  { t: 'Read the tree, not the list', giua: true, body: `<div data-k="chips" style="border:2px solid #e3c9ae;border-radius:12px;padding:10px 12px;background:#fffaf5"><div style="font-weight:800;color:#b85a2b;font-size:22px;margin-bottom:6px">${ra('c4/supply', 36, 36).split(':')[0]} direct dependencies</div>${deps4.map(chip).join('')}</div>` +
    two(box('Level 1', 'What express itself declares: the chips above.', 'lam'), box('Level 2, 3...', 'Each of those declares its own. The whole tree is what you installed: <code class="i">npm ls --all</code>.', '')) + box('Approving one name', 'means trusting 31 direct packages, and everything they trust in turn: 68 in total.', 'do2') },

  { t: 'Installing runs code, before you import anything', giua: true, body: term(gay(ra('c4/postinstall', 1, 8), 100), { title: 'a harmless package whose only job is to prove it', hl: [6] }) +
    two(box('postinstall', 'A lifecycle script: npm runs it <b>automatically</b> right after installing the package.', 'lam'), box('Safety for this demo', 'It runs in a <b>throw-away HOME folder</b> and writes one file plus a <b>count</b> of environment variables. Never names, never values.', 'xanh')) },

  { t: 'Run it for real', to: true, giua: true, body: two(term(gay(ra('c4/postinstall', 9, 15), 40), { title: 'terminal', hl: [5, 6, 7, 8, 9] }), cot(
    box('Read it again', 'No import, no require, not one line of our code ran. The package still wrote a file <b>outside</b> the project.', 'do2'),
    box('A real attacker', 'Reads your environment variables, SSH keys, cloud credentials, instead of writing a harmless file.', 'do2'))) + flow([
    { t: 'npm install', s: 'you typed it', mau: LAM }, { t: 'postinstall', s: 'runs by itself', mau: DO }, { t: 'File written', s: 'outside the project', mau: DO }, { t: 'Your code', s: 'never ran', mau: NODE }], { h: 140, fs: 22 }) },

  { t: 'Block install scripts', to: true, giua: true, body: two(term(gay(ra('c4/postinstall', 17, 23), 40), { title: 'npm install --ignore-scripts', hl: [6, 7, 9] }), cot(
    box('A good default for CI', '<code class="i">--ignore-scripts</code>: the package is installed, its scripts never run.', 'xanh'),
    box('But test it first', 'Some honest packages need an install script to compile native code: sharp, bcrypt, better-sqlite3.', ''),
    box('Make it permanent', '<code class="i">npm config set ignore-scripts true</code>, then allow exceptions one by one.', 'lam'))) },

  { t: 'Pinning is not the same as safe', giua: true, body: two(term(gay([ra('c4/audit', 1, 2), '...', ra('c4/audit', 48, 49), ra('c4/audit', 52, 55), '...', ra('c4/audit', 58, 58)].join('\n'), 58), { title: 'npm audit · express 4.18.0 pinned (abridged)', hl: [4, 5, 6] }), cot(
    box('Three high', 'Not one in code we wrote. All in dependencies of dependencies.', 'do2'),
    box('Pinning gives you', '<b>Reproducibility</b>: the same tree everywhere.', 'xanh'),
    box('Pinning does not give you', '<b>Immunity</b>: a pinned tree left alone for two years is a museum of published vulnerabilities.', 'do2')), 'r64') },

  { t: 'Balance the two', to: true, giua: true, body: cards([
    ['📌 Pin to reproduce', 'Commit the lockfile, install with npm ci everywhere (lesson 4.2).'],
    ['🗓️ Update on a schedule', 'Run npm audit and npm outdated regularly, not "when something breaks".'],
    ['🔍 Read before you fix', 'npm audit fix --force may jump a version you pinned. Look at what it plans first.'],
  ], 3) + term(ra('c4/audit', 10, 11), { title: 'from the real audit report: what --force would do', hl: [2] }) + box('Rule', 'Fix on purpose, with tests, in a branch. Never a blind --force on main. Then re-run npm audit to confirm the count went down.', 'xanh') },

  { t: 'Before you add a dependency', to: true, giua: true, body: cards([
    ['1 · Do you really need it?', 'Modern Node already has fetch, a test runner, watch mode, structuredClone and argument parsing.'],
    ['2 · Spell the name letter by letter', 'Typosquatting is real. Copy the name from the official docs, never type it from memory.'],
    ['3 · Count what it pulls in', 'Run npm ls after installing. A "tiny utility" that brings 40 packages is not tiny.'],
    ['4 · Check it is maintained', 'Last release, open issues, and whether one person carries what a million projects depend on.'],
  ], 2) + bang(['You might install', 'Node 22 already has'], [
    ['node-fetch, axios (simple calls)', '<code class="i">fetch(url)</code>'],
    ['mocha, jest (to start)', '<code class="i">node --test</code>'],
    ['nodemon', '<code class="i">node --watch</code> (lesson 4.1)'],
    ['lodash.clonedeep', '<code class="i">structuredClone(obj)</code>'],
  ], { co: 20 }) },

  { t: 'Typosquatting: look, never install', giua: true, body: two(term(gay(ra('c4/supply', 23, 34), 46), { title: 'npm view reads metadata, runs no code', hl: [7, 8, 11, 12] }), cot(
    box('expres', 'A real, different package: one letter away from express.', ''),
    box('lodahs, crossenv', '"security holding package": npm removed a malicious package and parked the name so nobody can reuse it.', 'do2'),
    box('So', 'Typos are a known attack, used often enough for npm to keep a parking lot.', 'lam'))) + box('Habit', 'Copy the install command from the package\'s official page. Check the weekly downloads and the repository link before the first install.', 'xanh') },

  { t: 'The riskiest moment is an update', giua: true, body: flow([
    { t: 'Account stolen', s: 'a trusted maintainer', mau: DO },
    { t: 'Bad patch', s: 'published as x.y.z+1', mau: DO },
    { t: 'Caret, no lockfile', s: 'your range accepts it', mau: CAM },
    { t: 'Your next build', s: 'runs it automatically', mau: DO },
  ], { h: 170, fs: 23 }) + box('History', 'The damaging npm incidents hit popular, trusted packages whose maintainer account was taken over. Not the package you chose badly: the update you never looked at.', 'do2') +
    box('This website', 'Secrets live in the server\'s runtime environment, never in the repo. No long-lived credentials in CI. The deploy account cannot read the production database. The blast radius is kept small on purpose.', 'xanh') },

  { t: 'Shrink what a dependency can do to you', to: true, giua: true, body: steps([
    '<b>Read the tree, not the list.</b> <code class="i">npm ls --all</code> is the real surface you installed.',
    '<b>Install scripts run before any import.</b> <code class="i">--ignore-scripts</code> in CI; review the few packages that truly need one.',
    '<b>Pin with the lockfile, install with npm ci.</b> A range lets an unreviewed patch in.',
    '<b>Check what CHANGED, not only what is broken.</b> npm audit for known issues, plus the lockfile diff in code review.',
  ]) + js(`npm ci --ignore-scripts          # CI: exact tree, no install scripts
npm audit                        # known vulnerabilities, on a schedule
git diff main -- package-lock.json   # in review: what changed?`, { sm: false }) },

  { t: 'Exercise: which commands run the package\'s code?', to: true, giua: true, body: two(`<ol style="font-size:26px">
<li><code class="i">npm view lodahs</code></li>
<li><code class="i">npm install ./goi-vo-hai</code></li>
<li><code class="i">npm install --ignore-scripts ./goi-vo-hai</code></li>
<li><code class="i">node app.js</code>, where app.js imports the package</li></ol>`,
    `<div data-k="dapan">${bang(['', 'Runs its code?', 'Why'], [
      ['1', 'no', 'reads metadata only'],
      ['2', '<b class="do">yes</b>', 'postinstall runs at install'],
      ['3', 'not at install', 'scripts blocked'],
      ['4', '<b class="do">yes</b>', 'importing runs the module'],
    ], { co: 21 })}</div>`) + box('Remember', '--ignore-scripts closes the install door. The import door is still open: that is why you choose and update carefully.', 'lam') },

  { t: 'Check yourself + summary', giua: true, body: `
<ol>
<li>Your lockfile pins every version. Are you safe from known vulnerabilities?</li>
<li>Why is <code class="i">--ignore-scripts</code> a good default in CI?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. No: pinning reproduces, it does not patch. Run npm audit on a schedule. &nbsp; 2. Install scripts run code before any import; CI holds secrets.', 'xanh')}</div>
<ul>
<li>1 dependency declared, 68 packages installed: read the tree</li>
<li>Install can run code; block scripts in CI</li>
<li>Pin + update on a schedule; check names; review lockfile diffs</li>
</ul>
${box('Next', 'Chapter 5: Express, the frame of every API.', 'lam')}` },
]);
