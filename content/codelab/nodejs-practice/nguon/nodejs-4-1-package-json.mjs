/** Node.js 4.1 — package.json và npm scripts: dependencies vs devDependencies, lệnh chạy script, rủi ro "Cannot find module" sau deploy, pre/post hook. */
import { doiDau, KHOA, cs, bang1, tn, nodeBai, nguon, goi } from './_node-c3-5.mjs';

const CHO = ['dependencies', 'devDependencies'];
const E1 = cs({
  ten: '4.1 · dependencies or devDependencies?', kho: 'EASY', phut: 6, loai: 'table',
  en: 'The lesson’s rule of thumb: <i>if src/ imports it, it belongs in dependencies</i>. Production installs with <code>npm ci --omit=dev</code>, which skips devDependencies. Place each package of a Notes API (Express + Prisma + bcrypt, linted with ESLint, written in TypeScript and tested with Vitest).',
  vi: 'Quy tắc nhanh của bài: <i>nếu src/ import nó, nó thuộc dependencies</i>. Production cài bằng <code>npm ci --omit=dev</code>, bỏ qua devDependencies. Xếp từng gói của một Notes API (Express + Prisma + bcrypt, lint bằng ESLint, viết bằng TypeScript và test bằng Vitest).',
  bang: [
    bang1('b1', ['Where does each package go?', 'Mỗi gói thuộc nhóm nào?'],
      [{ ma: 'pkg', ten: 'Package' }, { ma: 'where', ten: 'Goes in', luaChon: CHO }],
      [
        { o: { pkg: 'express — imported by src/app.js' }, a: { where: 'dependencies' } },
        { o: { pkg: 'eslint — run by "npm run lint"' }, a: { where: 'devDependencies' } },
        { o: { pkg: '@prisma/client — imported by src/services/notes.service.js' }, a: { where: 'dependencies' } },
        { o: { pkg: 'bcrypt — hashes passwords at login' }, a: { where: 'dependencies' } },
        { o: { pkg: 'prettier — formats code before commit' }, a: { where: 'devDependencies' } },
        { o: { pkg: 'typescript — compiles src/ to dist/ at build time' }, a: { where: 'devDependencies' } },
        { o: { pkg: 'vitest — runs the test files' }, a: { where: 'devDependencies' } },
        { o: { pkg: 'dotenv — imported by src/config.js to read .env' }, a: { where: 'dependencies' } },
      ],
      ['Anything the running server imports must survive --omit=dev. Tools that only run on your machine or in CI (lint, format, compile, test) do not. The expensive mistake is the opposite of tidy: it works locally, where everything is installed, and dies after deploy with Cannot find module.', 'Mọi thứ server đang chạy import phải sống sót qua --omit=dev. Công cụ chỉ chạy trên máy bạn hay trong CI (lint, format, biên dịch, test) thì không cần. Sai lầm đắt giá là chiều ngược lại: chạy ổn ở máy (nơi mọi thứ đã cài) và chết sau deploy với Cannot find module.']),
  ],
  goiY: [['Ask of each one: does the running production server import it?', 'Hỏi với từng gói: server production đang chạy có import nó không?'], ['A compiler that produced dist/ is no longer needed once dist/ exists.', 'Trình biên dịch đã tạo ra dist/ thì không còn cần khi dist/ đã có.']],
  loi: [['Putting dotenv or bcrypt in devDependencies because “it is just a helper”.', 'Đặt dotenv hay bcrypt vào devDependencies vì “chỉ là thư viện phụ”.'], ['Putting everything in dependencies “to be safe”: a bigger image with more to attack.', 'Đặt hết vào dependencies “cho chắc”: image to hơn, nhiều thứ để tấn công hơn.']],
  tns: [tn('dependencies', 'gói cần khi chạy'), tn('devDependencies', 'gói chỉ cần khi phát triển'), tn('--omit=dev', 'bỏ qua devDependencies khi cài')],
  kn: ['npm', 'package.json'],
});

/* ─── 2. lệnh chạy từng script ─── */
function howToRun(pkg) {
  // start, test, stop and restart are npm commands of their own; everything else needs "run"
  const SHORT = ['start', 'test', 'stop', 'restart'];
  return Object.keys(pkg.scripts || {}).map((name) => (SHORT.includes(name) ? `npm ${name}` : `npm run ${name}`));
}
const E2 = nodeBai({
  ten: '4.1 · Turn the scripts block into the commands a newcomer types', kho: 'EASY', phut: 8,
  en: `<p>“Scripts are how a project documents itself.” Write <code>howToRun(pkg)</code>: for every key of <code>pkg.scripts</code>, in order, the command a newcomer types. <code>start</code>, <code>test</code>, <code>stop</code> and <code>restart</code> are npm commands of their own (<code>npm start</code>); every other script needs <code>run</code> (<code>npm run dev</code>). No <code>scripts</code> → <code>[]</code>.</p><pre>{ "scripts": { "dev": "node --watch src/index.js", "start": "node src/index.js", "test": "node --test", "lint": "eslint src" } }
→ ["npm run dev", "npm start", "npm test", "npm run lint"]</pre>`,
  vi: `<p>“Scripts là cách một dự án tự mô tả.” Viết <code>howToRun(pkg)</code>: với mỗi khoá của <code>pkg.scripts</code>, theo thứ tự, lệnh mà người mới vào gõ. <code>start</code>, <code>test</code>, <code>stop</code> và <code>restart</code> là lệnh riêng của npm (<code>npm start</code>); mọi script khác cần <code>run</code> (<code>npm run dev</code>). Không có <code>scripts</code> → <code>[]</code>.</p><pre>{ "scripts": { "dev": "node --watch src/index.js", "start": "node src/index.js", "test": "node --test", "lint": "eslint src" } }
→ ["npm run dev", "npm start", "npm test", "npm run lint"]</pre>`,
  dauVao: ['pkg — a parsed package.json', 'pkg — package.json đã parse'], dauRa: ['array of commands', 'mảng các lệnh'],
  goiY: [['Object.keys keeps the order the keys were written in.', 'Object.keys giữ đúng thứ tự các khoá được viết.'], ['pkg.scripts may be missing — default to {}.', 'pkg.scripts có thể vắng — mặc định {}.']],
  loi: [['Writing "npm dev": npm answers Unknown command.', 'Viết "npm dev": npm trả lời Unknown command.'], ['Treating "build" like "start": "npm build" is a different (old) npm command, not your script.', 'Coi "build" như "start": "npm build" là một lệnh npm khác (cũ), không phải script của bạn.']],
  gt: ['Checked on npm 10.9: <code>npm test</code> and <code>npm start</code> run the scripts directly, any other name needs <code>npm run</code>. Inside a script, binaries from <code>node_modules/.bin</code> are on the PATH, which is why <code>"lint": "eslint src"</code> works while typing <code>eslint</code> in your shell does not (use <code>npx eslint</code>).', 'Đã kiểm trên npm 10.9: <code>npm test</code> và <code>npm start</code> chạy thẳng script, mọi tên khác cần <code>npm run</code>. Bên trong script, các tệp chạy trong <code>node_modules/.bin</code> nằm trên PATH, vì thế <code>"lint": "eslint src"</code> chạy được còn gõ <code>eslint</code> trong shell thì không (dùng <code>npx eslint</code>).'],
  kn: ['npm scripts'], tns: [tn('npm scripts', 'các lệnh đặt tên trong package.json'), tn('PATH', 'biến môi trường chứa các thư mục tìm lệnh')],
  dau: `/** the command a newcomer types for each script */
function howToRun(pkg) {
  // Write your solution here
  return Object.keys(pkg.scripts).map((name) => 'npm ' + name);
}
`,
  giai: '// Reference solution — four built-in shortcuts, "run" for the rest\n' + nguon(howToRun),
  cases: [
    { goi: goi('howToRun', { scripts: { dev: 'node --watch src/index.js', start: 'node src/index.js', test: 'node --test', lint: 'eslint src' } }), moTa: ['The lesson’s notes-api scripts', 'Scripts notes-api của bài'] },
    { goi: goi('howToRun', { name: 'npmdemo', scripts: { test: 'echo "Error: no test specified" && exit 1' } }), moTa: ['The npm init -y skeleton', 'Khung npm init -y'] },
    { goi: goi('howToRun', { name: 'empty' }), an: true },
    { goi: goi('howToRun', { scripts: { build: 'tsc', stop: 'pkill node', restart: 'npm stop && npm start', 'db:migrate': 'prisma migrate deploy' } }), an: true },
  ],
});

/* ─── 3. Cannot find module sau deploy ─── */
function packageName(spec) {
  // "@prisma/client/edge" → "@prisma/client", "lodash/fp" → "lodash"
  const parts = spec.split('/');
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}
function prodCrashRisks(pkg, imports) {
  const BUILTIN = ['assert', 'buffer', 'child_process', 'crypto', 'events', 'fs', 'fs/promises', 'http', 'https', 'os', 'path', 'readline', 'stream', 'string_decoder', 'url', 'util', 'zlib'];
  const deps = pkg.dependencies || {};
  const dev = pkg.devDependencies || {};
  const found = new Map();
  for (const spec of imports) {
    // relative files and Node's own modules are never installed from npm
    if (spec.startsWith('.') || spec.startsWith('/') || spec.startsWith('node:') || BUILTIN.includes(spec)) continue;
    const name = packageName(spec);
    if (name in deps) continue;                                   // safe: installed with --omit=dev
    found.set(name, name in dev ? 'devDependency' : 'missing');   // dev-only: works locally, dies in production
  }
  return [...found].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([name, problem]) => ({ name, problem }));
}
const E3 = nodeBai({
  ten: '4.1 · Find the imports that will crash after deploy', kho: 'MEDIUM', phut: 18,
  en: `<p>“A very common production crash: putting something in devDependencies that production actually imports. It works locally and dies on the server with <i>Cannot find module</i> — but only after deploy.” Catch it before deploy. Write <code>prodCrashRisks(pkg, imports)</code> where <code>imports</code> lists every module specifier found in <code>src/</code>:</p>
<ul><li>ignore relative/absolute files (<code>./</code>, <code>../</code>, <code>/</code>), <code>node:</code> specifiers and these core modules: <code>assert buffer child_process crypto events fs fs/promises http https os path readline stream string_decoder url util zlib</code>;</li><li>the package name of a specifier: <code>"lodash/fp"</code> → <code>"lodash"</code>, <code>"@prisma/client/edge"</code> → <code>"@prisma/client"</code>;</li><li>in <code>dependencies</code> → fine; only in <code>devDependencies</code> → <code>"devDependency"</code>; in neither → <code>"missing"</code>.</li></ul><p>Return <code>[{ name, problem }]</code>, one entry per package, sorted by name.</p>`,
  vi: `<p>“Một kiểu sập production rất hay gặp: đặt vào devDependencies thứ mà production thật sự import. Ở máy thì chạy, lên server thì chết với <i>Cannot find module</i> — nhưng chỉ sau khi deploy.” Bắt nó trước khi deploy. Viết <code>prodCrashRisks(pkg, imports)</code> với <code>imports</code> liệt kê mọi module specifier tìm thấy trong <code>src/</code>:</p>
<ul><li>bỏ qua file tương đối/tuyệt đối (<code>./</code>, <code>../</code>, <code>/</code>), specifier <code>node:</code> và các module lõi này: <code>assert buffer child_process crypto events fs fs/promises http https os path readline stream string_decoder url util zlib</code>;</li><li>tên gói của một specifier: <code>"lodash/fp"</code> → <code>"lodash"</code>, <code>"@prisma/client/edge"</code> → <code>"@prisma/client"</code>;</li><li>có trong <code>dependencies</code> → ổn; chỉ có trong <code>devDependencies</code> → <code>"devDependency"</code>; không có ở đâu → <code>"missing"</code>.</li></ul><p>Trả về <code>[{ name, problem }]</code>, mỗi gói một mục, sắp theo tên.</p>`,
  dauVao: ['pkg — package.json; imports — array of specifiers (may repeat)', 'pkg — package.json; imports — mảng specifier (có thể lặp)'], dauRa: ['[{ name, problem: "devDependency" | "missing" }] sorted by name', '[{ name, problem: "devDependency" | "missing" }] sắp theo tên'],
  goiY: [['First filter what can never come from npm; then map each specifier to its package name.', 'Lọc trước những thứ không bao giờ đến từ npm; rồi đổi mỗi specifier thành tên gói.'], ['A scoped name has two segments: "@scope/name". Everything else has one.', 'Tên có scope gồm hai đoạn: "@scope/name". Mọi tên khác có một.'], ['Use a Map (or object) keyed by package name so a package imported from ten files appears once.', 'Dùng Map (hoặc object) theo tên gói để gói được import từ mười file chỉ xuất hiện một lần.']],
  loi: [['Looking up "lodash/fp" in dependencies instead of "lodash".', 'Tra "lodash/fp" trong dependencies thay vì "lodash".'], ['Cutting "@prisma/client/edge" at the first "/": "@prisma" is not a package.', 'Cắt "@prisma/client/edge" ở dấu "/" đầu: "@prisma" không phải một gói.'], ['Reporting "fs" or "node:path" as missing.', 'Báo "fs" hay "node:path" là thiếu.']],
  gt: ['This is the lesson’s rule of thumb turned into a check you could run in CI. Resolution in Node works on the package name, not the full specifier — which is why <code>@scope/name</code> and subpath imports need care. A list like this, red in CI, costs nothing; the same mistake found in production costs a rollback.', 'Đây là quy tắc nhanh của bài biến thành một phép kiểm chạy được trong CI. Node tìm module theo tên gói, không theo cả specifier — vì thế <code>@scope/name</code> và import đường con cần cẩn thận. Một danh sách như thế này, đỏ trong CI, không tốn gì; cùng lỗi đó gặp trên production thì tốn một lần rollback.'],
  kn: ['npm', 'modules'], tns: [tn('module specifier', 'chuỗi trong import/require'), tn('scoped package', 'gói có phạm vi', '@scope/name'), tn('subpath', 'đường con trong gói', 'lodash/fp')],
  dau: `/** imports from src/ that will fail with "npm ci --omit=dev" */
function prodCrashRisks(pkg, imports) {
  // Write your solution here — this compares the raw specifiers
  const dev = pkg.devDependencies || {};
  return imports.filter((s) => s in dev).map((name) => ({ name, problem: 'devDependency' }));
}
`,
  giai: '// Reference solution — skip what npm never installs, compare package names\n' + nguon(packageName, prodCrashRisks),
  cases: [
    { goi: goi('prodCrashRisks', { dependencies: { express: '^5.2.1' }, devDependencies: { dotenv: '^16.4.0', eslint: '^9.0.0' } }, ['express', 'dotenv', './routes/notes.routes.js', 'node:path']), moTa: ['dotenv in the wrong group', 'dotenv sai nhóm'] },
    { goi: goi('prodCrashRisks', { dependencies: { express: '^5.2.1', '@prisma/client': '^5.22.0' } }, ['express', '@prisma/client', 'fs', 'path']), moTa: ['Nothing to report', 'Không có gì để báo'] },
    { goi: goi('prodCrashRisks', { dependencies: {}, devDependencies: { lodash: '^4.17.21' } }, ['lodash/fp', 'lodash', 'zod']), moTa: ['Subpath and a missing package', 'Đường con và một gói thiếu'] },
    { goi: goi('prodCrashRisks', { dependencies: { '@prisma/client': '^5.22.0' }, devDependencies: { '@types/node': '^22.0.0', '@sentry/node': '^8.0.0' } }, ['@prisma/client/edge', '@sentry/node', '../lib/x.js', '/abs/file.js', 'node:fs/promises', 'fs/promises', 'crypto']), an: true },
    { goi: goi('prodCrashRisks', { dependencies: { express: '^5' } }, ['zod', 'bcrypt', 'zod', 'axios/lib/core', 'express']), an: true },
    { goi: goi('prodCrashRisks', {}, []), an: true },
  ],
});

/* ─── 4. soát package.json ─── */
function checkPackageJson(pkg) {
  const problems = [];
  const scripts = pkg.scripts || {};
  if (pkg.type === undefined) problems.push('missing "type" (module system)');
  if (!pkg.engines || !pkg.engines.node) problems.push('missing engines.node');
  for (const s of ['dev', 'start', 'test']) if (!scripts[s]) problems.push(`missing script "${s}"`);
  // the skeleton from npm init -y: a test script that always fails
  if (scripts.test && scripts.test.includes('no test specified')) problems.push('test is the npm init placeholder');
  if (scripts.dev && /\bnodemon\b/.test(scripts.dev)) problems.push('dev uses nodemon; node --watch is built in');
  const dev = pkg.devDependencies || {};
  for (const name of Object.keys(pkg.dependencies || {})) if (name in dev) problems.push(`${name} is in both dependencies and devDependencies`);
  return problems;
}
const E4 = nodeBai({
  ten: '4.1 · Review a package.json like the lesson does', kho: 'MEDIUM', phut: 15,
  en: `<p>The lesson turns <code>npm init -y</code>’s skeleton into a real backend manifest. Write <code>checkPackageJson(pkg)</code> that returns the problems it would point out, <b>in this order</b>:</p>
<ol><li><code>missing "type" (module system)</code> — no <code>type</code> field;</li><li><code>missing engines.node</code>;</li><li><code>missing script "dev"</code>, then <code>"start"</code>, then <code>"test"</code> — one line per missing script;</li><li><code>test is the npm init placeholder</code> — the test script contains <code>no test specified</code>;</li><li><code>dev uses nodemon; node --watch is built in</code> — the dev script mentions the word <code>nodemon</code>;</li><li><code>&lt;name&gt; is in both dependencies and devDependencies</code> — for each such package, in the order of <code>dependencies</code>.</li></ol><p>A clean manifest gives <code>[]</code>.</p>`,
  vi: `<p>Bài biến khung của <code>npm init -y</code> thành manifest của một backend thật. Viết <code>checkPackageJson(pkg)</code> trả về các vấn đề bài sẽ chỉ ra, <b>theo thứ tự này</b>:</p>
<ol><li><code>missing "type" (module system)</code> — không có trường <code>type</code>;</li><li><code>missing engines.node</code>;</li><li><code>missing script "dev"</code>, rồi <code>"start"</code>, rồi <code>"test"</code> — mỗi script thiếu một dòng;</li><li><code>test is the npm init placeholder</code> — script test chứa <code>no test specified</code>;</li><li><code>dev uses nodemon; node --watch is built in</code> — script dev nhắc tới từ <code>nodemon</code>;</li><li><code>&lt;tên&gt; is in both dependencies and devDependencies</code> — cho mỗi gói như vậy, theo thứ tự của <code>dependencies</code>.</li></ol><p>Manifest sạch cho <code>[]</code>.</p>`,
  dauVao: ['pkg — a parsed package.json', 'pkg — package.json đã parse'], dauRa: ['array of problem strings (exact texts above)', 'mảng chuỗi vấn đề (đúng chữ ở trên)'],
  goiY: [['Default the optional objects first: const scripts = pkg.scripts || {}.', 'Gán mặc định cho các object có thể vắng trước: const scripts = pkg.scripts || {}.'], ['Push problems in the order of the list; do not sort at the end.', 'Push vấn đề theo thứ tự danh sách; đừng sắp xếp ở cuối.'], ['/\\bnodemon\\b/ matches the word, not “nodemonitor”.', '/\\bnodemon\\b/ khớp đúng từ, không khớp “nodemonitor”.']],
  loi: [['Crashing on pkg.scripts.test when there is no scripts object.', 'Sập ở pkg.scripts.test khi không có object scripts.'], ['Treating "type": "commonjs" as missing — it is declared, just not ESM.', 'Coi "type": "commonjs" là thiếu — nó đã được khai, chỉ là không phải ESM.']],
  gt: ['Every rule is one sentence of the lesson: declare the module system and the Node version (this site pins it in three places that must agree), always have dev/start/test, and <code>node --watch</code> has replaced nodemon since Node 18 — one dependency less is one dependency less.', 'Mỗi luật là một câu của bài: khai hệ module và phiên bản Node (trang web này ghim nó ở ba chỗ phải khớp nhau), luôn có dev/start/test, và <code>node --watch</code> đã thay nodemon từ Node 18 — bớt một dependency là bớt một dependency.'],
  kn: ['package.json'], tns: [tn('manifest', 'tệp khai báo dự án'), tn('engines', 'phiên bản Node dự án cần')],
  dau: `/** the problems the lesson would point out, in order */
function checkPackageJson(pkg) {
  // Write your solution here
  const problems = [];
  if (!pkg.type) problems.push('missing "type" (module system)');
  return problems;
}
`,
  giai: '// Reference solution — one check per rule, in the order of the list\n' + nguon(checkPackageJson),
  cases: [
    { goi: goi('checkPackageJson', { name: 'npmdemo', version: '1.0.0', main: 'index.js', scripts: { test: 'echo "Error: no test specified" && exit 1' }, license: 'ISC' }), moTa: ['The npm init -y skeleton', 'Khung npm init -y'] },
    { goi: goi('checkPackageJson', { name: 'notes-api', type: 'module', engines: { node: '>=22' }, scripts: { dev: 'node --watch src/index.js', start: 'node src/index.js', test: 'node --test', lint: 'eslint src' } }), moTa: ['The lesson’s finished manifest', 'Manifest hoàn chỉnh của bài'] },
    { goi: goi('checkPackageJson', { type: 'commonjs', engines: { node: '22.x' }, scripts: { dev: 'nodemon src/index.js', start: 'node src/index.js', test: 'vitest' }, dependencies: { express: '^5', dotenv: '^16' }, devDependencies: { dotenv: '^16', eslint: '^9' } }), an: true },
    { goi: goi('checkPackageJson', { engines: {} }), an: true },
    { goi: goi('checkPackageJson', { type: 'module', engines: { node: '>=22' }, scripts: { dev: 'node --watch src/nodemonitor.js', start: 'node .', test: 'node --test' } }), an: true },
  ],
});

/* ─── 5. npm run và pre/post hook ─── */
function runScript(pkg, name, opts = {}) {
  const scripts = pkg.scripts || {};
  let main = scripts[name];
  // npm start has one default: "node server.js" when that file exists
  if (main === undefined && name === 'start' && (opts.files || []).includes('server.js')) main = 'node server.js';
  if (main === undefined) throw new Error(`Missing script: "${name}"`);
  const out = [];
  const add = (s, cmd) => { if (cmd !== undefined) out.push(`${s}: ${cmd}`); };
  if (!opts.ignoreScripts) add(`pre${name}`, scripts[`pre${name}`]);   // --ignore-scripts skips the hooks…
  add(name, main);                                                    // …but still runs the script you asked for
  if (!opts.ignoreScripts) add(`post${name}`, scripts[`post${name}`]);
  return out;
}
const E5 = nodeBai({
  ten: '4.1 · What does npm run really execute? (pre/post hooks)', kho: 'HARD', phut: 20,
  en: `<p>The lesson links npm’s scripts docs: “lifecycle hooks, pre/post, and why an install script is a supply-chain concern.” Model what npm 10 really runs. Write <code>runScript(pkg, name, opts)</code> returning the list <code>"&lt;script&gt;: &lt;command&gt;"</code> in execution order:</p>
<ul><li><code>pre&lt;name&gt;</code> (if defined), then <code>&lt;name&gt;</code>, then <code>post&lt;name&gt;</code> (if defined);</li><li>if <code>name</code> is not defined: <code>throw new Error('Missing script: "&lt;name&gt;"')</code> — except <code>start</code>, which defaults to <code>node server.js</code> when <code>opts.files</code> contains <code>"server.js"</code>;</li><li><code>opts.ignoreScripts</code> (<code>--ignore-scripts</code>) skips the pre/post hooks but still runs the script itself.</li></ul><p>All of this was measured on npm 10.9.9 — e.g. <code>npm run build</code> with prebuild/build/postbuild printed PRE, BUILD, POST; <code>npm run build --ignore-scripts</code> printed only BUILD.</p>`,
  vi: `<p>Bài dẫn tới tài liệu scripts của npm: “lifecycle hook, pre/post, và vì sao install script là mối lo chuỗi cung ứng.” Mô phỏng thứ npm 10 thật sự chạy. Viết <code>runScript(pkg, name, opts)</code> trả về danh sách <code>"&lt;script&gt;: &lt;lệnh&gt;"</code> theo thứ tự chạy:</p>
<ul><li><code>pre&lt;name&gt;</code> (nếu có), rồi <code>&lt;name&gt;</code>, rồi <code>post&lt;name&gt;</code> (nếu có);</li><li>nếu <code>name</code> không được khai: <code>throw new Error('Missing script: "&lt;name&gt;"')</code> — trừ <code>start</code>, mặc định là <code>node server.js</code> khi <code>opts.files</code> có <code>"server.js"</code>;</li><li><code>opts.ignoreScripts</code> (<code>--ignore-scripts</code>) bỏ qua hook pre/post nhưng vẫn chạy chính script đó.</li></ul><p>Tất cả đã đo trên npm 10.9.9 — vd <code>npm run build</code> với prebuild/build/postbuild in PRE, BUILD, POST; <code>npm run build --ignore-scripts</code> chỉ in BUILD.</p>`,
  dauVao: ['pkg; name — the script asked for; opts — { files?: string[], ignoreScripts?: boolean }', 'pkg; name — script được gọi; opts — { files?: string[], ignoreScripts?: boolean }'], dauRa: ['array of "script: command", or throws', 'mảng "script: lệnh", hoặc ném lỗi'],
  goiY: [['Resolve the main command first (including the start default), and throw if there is none.', 'Xác định lệnh chính trước (kể cả mặc định của start), không có thì ném.'], ['The hooks are just scripts named "pre" + name and "post" + name.', 'Hook chỉ là các script tên "pre" + name và "post" + name.']],
  loi: [['Running prebuild even when build itself is missing.', 'Chạy prebuild ngay cả khi chính build không có.'], ['Thinking --ignore-scripts refuses to run the script you typed.', 'Tưởng --ignore-scripts từ chối chạy cả script bạn gõ.'], ['Forgetting npm start’s server.js default.', 'Quên mặc định server.js của npm start.']],
  gt: ['Hooks run automatically, which is the whole point — and the whole risk: the same mechanism (<code>preinstall</code>, <code>postinstall</code>) runs a package’s code during <code>npm install</code>, before you import anything. Lesson 4.3 shows that with a harmless package that writes a file to your home folder.', 'Hook chạy tự động, đó là toàn bộ ý nghĩa — và toàn bộ rủi ro: cùng cơ chế đó (<code>preinstall</code>, <code>postinstall</code>) chạy code của một gói lúc <code>npm install</code>, trước khi bạn import gì. Bài 4.3 cho thấy điều đó bằng một gói vô hại ghi một file vào thư mục home của bạn.'],
  kn: ['npm scripts', 'lifecycle'], tns: [tn('lifecycle hook', 'móc vòng đời', 'pre/post scripts npm runs for you'), tn('--ignore-scripts', 'bỏ qua script tự chạy')],
  dau: `/** the commands npm runs for "npm run <name>", in order */
function runScript(pkg, name, opts = {}) {
  // Write your solution here
  return [name + ': ' + pkg.scripts[name]];
}
`,
  giai: '// Reference solution — pre, main, post; the start default; --ignore-scripts skips only the hooks\n' + nguon(runScript),
  cases: [
    { goi: goi('runScript', { scripts: { prebuild: 'echo PRE', build: 'echo BUILD', postbuild: 'echo POST' } }, 'build'), moTa: ['Measured: PRE, BUILD, POST', 'Đo được: PRE, BUILD, POST'] },
    { goi: goi('runScript', { scripts: { build: 'tsc' } }, 'nope'), nem: 'Error', thongDiep: 'Missing script: "nope"', moTa: ['Missing script', 'Thiếu script'] },
    { goi: goi('runScript', { scripts: { pretest: 'eslint src', test: 'node --test' } }, 'test'), moTa: ['npm test runs pretest too', 'npm test cũng chạy pretest'] },
    { goi: goi('runScript', { scripts: { prebuild: 'echo PRE', build: 'echo BUILD', postbuild: 'echo POST' } }, 'build', { ignoreScripts: true }), an: true },
    { goi: goi('runScript', { scripts: {} }, 'start', { files: ['server.js', 'package.json'] }), an: true },
    { goi: goi('runScript', { scripts: { test: 'x' } }, 'start', { files: ['index.js'] }), nem: 'Error', thongDiep: 'Missing script: "start"', an: true },
    { goi: goi('runScript', { scripts: { predev: 'npm run build', dev: 'node --watch src/index.js', poststart: 'echo up' } }, 'dev'), an: true },
    { goi: goi('runScript', { name: 'x' }, 'lint'), nem: 'Error', an: true },
  ],
});

export default doiDau({ slug: 'nodejs-4-1-package-json', ten: '4.1 package.json and npm scripts', khoa: KHOA, baiHoc: 'nodejs-4-1-package-json', de: [E1, E2, E3, E4, E5] });
