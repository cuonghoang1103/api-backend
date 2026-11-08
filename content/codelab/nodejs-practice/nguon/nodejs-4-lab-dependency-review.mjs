/** Node.js · Lab chương 4 — Bot soát dependency cho pull request: npm outdated (Current/Wanted/Latest) + báo cáo gộp 4.1–4.3 (crash sau deploy, lockfile lệch, install script, typosquat). */
import { doiDau, KHOA, cs, q, tn, nodeBai, nguon } from './_node-c3-5.mjs';

const E1 = {
  ...cs({
    ten: 'Lab 4 · 1 — Review this pull request', kho: 'EASY', phut: 6,
    en: 'A pull request changes <code>package.json</code> and <code>package-lock.json</code>. Decide like the bot you are about to build.',
    vi: 'Một pull request đổi <code>package.json</code> và <code>package-lock.json</code>. Quyết định như con bot bạn sắp viết.',
    cau: [
      q('c1', ['The diff adds <code>"expres": "^4.18.0"</code> to dependencies. The bot should…', 'Diff thêm <code>"expres": "^4.18.0"</code> vào dependencies. Bot nên…'],
        ['Fail: one deleted letter from "express" — a classic typosquat', 'Pass: the range is the same as express’s, so it is safe', 'Pass with a warning: misspelled names are only a style issue', 'Fail only if npm audit reports a vulnerability for it'],
        ['Typosquats rarely have audit advisories when they are new — the name is the signal.', 'Gói typosquat mới thường chưa có bản tin audit — chính cái tên là tín hiệu.']),
      q('c2', ['package.json now says <code>^5.0.0</code> for express, but the lockfile still pins <code>4.18.0</code>. What happens in CI with <code>npm ci</code>?', 'package.json giờ ghi <code>^5.0.0</code> cho express, nhưng lockfile vẫn ghim <code>4.18.0</code>. Trong CI với <code>npm ci</code> thì sao?'],
        ['It fails: package.json and the lockfile are out of sync', 'It installs 4.18.0 from the lockfile and ignores package.json', 'It installs the newest 5.x and updates the lockfile', 'It installs both versions side by side'],
        ['npm ci never resolves — it refuses when the two files disagree. The fix is to run npm install locally and commit the regenerated lockfile.', 'npm ci không bao giờ phân giải — nó từ chối khi hai tệp không khớp. Cách sửa là chạy npm install ở máy rồi commit lockfile mới.']),
      q('c3', ['The lockfile diff shows a new transitive package with <code>"hasInstallScript": true</code> that nobody mentioned. Best reaction?', 'Diff lockfile có thêm một gói bắc cầu mới với <code>"hasInstallScript": true</code> mà không ai nhắc tới. Phản ứng tốt nhất?'],
        ['Ask why it is there and what its script does before merging', 'Merge — transitive packages are the maintainers’ responsibility', 'Delete the line from the lockfile by hand', 'Add it to devDependencies so it does not ship'],
        ['“An unexplained new transitive dependency is worth a question” — and one that runs code at install time even more so.', '“Một phụ thuộc bắc cầu mới không rõ lý do đáng để hỏi” — và một gói chạy code lúc cài thì càng đáng hơn.']),
      q('c4', ['<code>npm outdated</code> shows express: Current 4.18.0, Wanted 4.22.2, Latest 5.2.1. What does “Wanted” mean?', '<code>npm outdated</code> cho express: Current 4.18.0, Wanted 4.22.2, Latest 5.2.1. “Wanted” nghĩa là gì?'],
        ['The highest version your range ^4.18.0 allows — what npm update would move to', 'The version the express team recommends for new projects', 'The version written in the lockfile', 'The version with no known vulnerabilities'],
        ['Wanted = maxSatisfying(range). Latest = the registry’s latest tag. Getting from Wanted to Latest is a deliberate major upgrade.', 'Wanted = maxSatisfying(range). Latest = nhãn latest của registry. Đi từ Wanted lên Latest là một lần nâng major có chủ ý.']),
    ],
    goiY: [['Each question maps to one lesson: 4.1, 4.2 or 4.3.', 'Mỗi câu ứng với một bài: 4.1, 4.2 hoặc 4.3.'], ['A bot should be strict about what can break production and only informative about the rest.', 'Bot nên nghiêm với thứ có thể làm sập production và chỉ thông báo với phần còn lại.']],
    loi: [['Trusting a name because the version range looks normal.', 'Tin một cái tên vì khoảng phiên bản trông bình thường.'], ['Fixing an out-of-sync lockfile by hand-editing it.', 'Sửa lockfile lệch bằng cách sửa tay.']],
    tns: [tn('pull request', 'yêu cầu gộp code'), tn('code review', 'duyệt code')],
    kn: ['npm', 'security'],
  }),
  dangBai: 'lab',
};

/* ─── provided helpers (lesson solutions) ─── */
function compareVersions(a, b) {
  const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
  return 0;
}
function satisfies(version, range) {
  const v = version.split('.').map(Number);
  const op = range[0] === '^' || range[0] === '~' ? range[0] : '';
  const b = range.slice(op.length).split('.').map(Number);
  const cmp = compareVersions(version, b.join('.'));
  if (op === '') return cmp === 0;
  if (cmp < 0) return false;
  if (op === '~') return v[0] === b[0] && v[1] === b[1];
  if (b[0] > 0) return v[0] === b[0];
  if (b[1] > 0) return v[0] === 0 && v[1] === b[1];
  return v[0] === 0 && v[1] === 0 && v[2] === b[2];
}
function maxSatisfying(versions, range) {
  let best = null;
  for (const v of versions) if (!v.includes('-') && satisfies(v, range) && (best === null || compareVersions(v, best) > 0)) best = v;
  return best;
}
function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  return d[a.length][b.length];
}
function packageName(spec) {
  const parts = spec.split('/');
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}
const HELPERS = `// ── provided: your solutions from lessons 4.1–4.3 ──
${nguon(compareVersions, satisfies, maxSatisfying, distance, packageName)}`;

/* ─── Lab 4 · 2 — npm outdated ─── */
function outdated(lock, registry) {
  const root = lock.packages[''] || {};
  const rows = [];
  for (const [group, deps] of [['dependencies', root.dependencies || {}], ['devDependencies', root.devDependencies || {}]]) {
    for (const [name, range] of Object.entries(deps)) {
      const entry = lock.packages[`node_modules/${name}`];
      const current = entry ? entry.version : 'MISSING';
      const info = registry[name];
      const wanted = maxSatisfying(info.versions, range) || current;   // what npm update would move to
      const latest = info.latest;                                       // the registry's "latest" tag
      if (current !== wanted || current !== latest) rows.push({ name, current, wanted, latest, type: group });
    }
  }
  return rows.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}
const REG = {
  express: { versions: ['4.17.3', '4.18.0', '4.18.3', '4.21.2', '4.22.2', '5.0.0', '5.1.0', '5.2.1'], latest: '5.2.1' },
  '@prisma/client': { versions: ['5.20.0', '5.22.0', '6.0.0', '6.1.0'], latest: '6.1.0' },
  eslint: { versions: ['9.10.0', '9.12.0'], latest: '9.12.0' },
  zod: { versions: ['3.23.8', '3.24.1', '4.0.0-beta.1'], latest: '3.24.1' },
  expres: { versions: ['4.18.0'], latest: '4.18.0' },
  dotenv: { versions: ['16.4.5', '16.4.7'], latest: '16.4.7' },
  sharp: { versions: ['0.33.5', '0.34.1'], latest: '0.34.1' },
};
const LOCK_A = {
  lockfileVersion: 3,
  packages: {
    '': { name: 'notes-api', dependencies: { express: '^4.18.0', '@prisma/client': '^5.20.0', zod: '^3.24.1' }, devDependencies: { eslint: '^9.10.0' } },
    'node_modules/express': { version: '4.18.0' }, 'node_modules/@prisma/client': { version: '5.22.0', hasInstallScript: true },
    'node_modules/@prisma/engines': { version: '5.22.0', hasInstallScript: true }, 'node_modules/zod': { version: '3.24.1' }, 'node_modules/eslint': { version: '9.12.0' },
  },
};
const DATA = `const REG = ${JSON.stringify(REG)};
const LOCK_A = ${JSON.stringify(LOCK_A)};`;
const E2 = nodeBai({
  ten: 'Lab 4 · 2 — npm outdated: Current, Wanted, Latest', kho: 'MEDIUM', phut: 20, dangBai: 'lab',
  en: `<p><b>Brief.</b> The first half of the bot prints what <code>npm outdated</code> prints. Write <code>outdated(lock, registry)</code>:</p>
<ul><li>for every package declared in the lockfile root (<code>lock.packages[""].dependencies</code>, then <code>devDependencies</code>) with its range:</li><li><b>Current</b> = <code>lock.packages["node_modules/&lt;name&gt;"].version</code>, or <code>"MISSING"</code> if that entry does not exist;</li><li><b>Wanted</b> = <code>maxSatisfying(registry[name].versions, range)</code> (if nothing satisfies, Wanted = Current);</li><li><b>Latest</b> = <code>registry[name].latest</code>;</li><li>keep a row <code>{ name, current, wanted, latest, type }</code> (<code>type</code> = <code>"dependencies"</code> or <code>"devDependencies"</code>) only if current ≠ wanted or current ≠ latest; sort rows by name.</li></ul><p><code>compareVersions</code>, <code>satisfies</code>, <code>maxSatisfying</code> are provided.</p>`,
  vi: `<p><b>Đề.</b> Nửa đầu của bot in ra thứ <code>npm outdated</code> in. Viết <code>outdated(lock, registry)</code>:</p>
<ul><li>với mỗi gói được khai trong gốc lockfile (<code>lock.packages[""].dependencies</code>, rồi <code>devDependencies</code>) cùng khoảng của nó:</li><li><b>Current</b> = <code>lock.packages["node_modules/&lt;tên&gt;"].version</code>, hoặc <code>"MISSING"</code> nếu không có mục đó;</li><li><b>Wanted</b> = <code>maxSatisfying(registry[name].versions, range)</code> (không có bản nào thoả thì Wanted = Current);</li><li><b>Latest</b> = <code>registry[name].latest</code>;</li><li>chỉ giữ hàng <code>{ name, current, wanted, latest, type }</code> (<code>type</code> = <code>"dependencies"</code> hoặc <code>"devDependencies"</code>) khi current ≠ wanted hoặc current ≠ latest; sắp các hàng theo tên.</li></ul><p>Có sẵn <code>compareVersions</code>, <code>satisfies</code>, <code>maxSatisfying</code>.</p>`,
  dauVao: ['lock — lockfile v3; registry — { name: { versions, latest } }', 'lock — lockfile v3; registry — { tên: { versions, latest } }'], dauRa: ['rows sorted by name', 'các hàng sắp theo tên'],
  goiY: [['Loop over [["dependencies", deps], ["devDependencies", devDeps]] so the type comes for free.', 'Lặp qua [["dependencies", deps], ["devDependencies", devDeps]] để có type sẵn.'], ['A package that is up to date on both columns produces no row.', 'Gói đã mới ở cả hai cột không tạo hàng nào.']],
  loi: [['Taking Current from the range in package.json: "^4.18.0" is not a version.', 'Lấy Current từ khoảng trong package.json: "^4.18.0" không phải một phiên bản.'], ['Computing Wanted as the newest version overall: that is Latest.', 'Tính Wanted là bản mới nhất nói chung: đó là Latest.'], ['Picking a pre-release (4.0.0-beta.1) as Wanted.', 'Chọn một pre-release (4.0.0-beta.1) làm Wanted.']],
  gt: ['Three columns, three questions: what runs now (lockfile), what an <code>npm update</code> would give within your ranges, and what exists beyond them. The gap between Current and Wanted is “update on a schedule”; the gap between Wanted and Latest is a major upgrade you plan — with the changelog open.', 'Ba cột, ba câu hỏi: cái gì đang chạy (lockfile), <code>npm update</code> sẽ cho gì trong các khoảng của bạn, và cái gì có ở ngoài chúng. Khoảng cách Current → Wanted là “cập nhật theo lịch”; Wanted → Latest là một lần nâng major bạn lên kế hoạch — với changelog mở sẵn.'],
  kn: ['npm', 'semver'], tns: [tn('npm outdated', 'liệt kê gói đã cũ'), tn('dist-tag latest', 'nhãn latest trên registry')],
  chung: DATA,
  dau: `${HELPERS}
/** the rows npm outdated would print */
function outdated(lock, registry) {
  // Write your solution here
  return [];
}
`,
  giai: `${HELPERS}
// Reference solution — Current from the lockfile, Wanted from the range, Latest from the registry
${nguon(outdated)}`,
  cases: [
    { goi: 'outdated(LOCK_A, REG)', moTa: ['The notes-api lockfile', 'Lockfile của notes-api'] },
    { goi: 'outdated({ packages: { "": { dependencies: { zod: "^3.24.1" } }, "node_modules/zod": { version: "3.24.1" } } }, REG)', moTa: ['Up to date: no row', 'Đã mới: không có hàng'] },
    { goi: 'outdated({ packages: { "": { dependencies: { dotenv: "^16.4.5" }, devDependencies: { express: "~4.18.0", sharp: "^0.33.5" } }, "node_modules/express": { version: "4.18.3" }, "node_modules/sharp": { version: "0.33.5" } } }, REG)', an: true },
    { goi: 'outdated({ packages: { "": { dependencies: { express: "^6.0.0" } }, "node_modules/express": { version: "5.2.1" } } }, REG)', an: true },
  ],
});

/* ─── Lab 4 · 3 — báo cáo gộp ─── */
function reviewDependencies({ lock, imports, registry, allowScripts, popular }) {
  const root = lock.packages[''] || {};
  const deps = root.dependencies || {};
  const dev = root.devDependencies || {};
  const BUILTIN = ['assert', 'buffer', 'child_process', 'crypto', 'events', 'fs', 'fs/promises', 'http', 'https', 'os', 'path', 'readline', 'stream', 'string_decoder', 'url', 'util', 'zlib'];
  const byName = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  // 4.1 — what src/ imports must be in dependencies
  const risks = new Map();
  for (const spec of imports) {
    if (spec.startsWith('.') || spec.startsWith('/') || spec.startsWith('node:') || BUILTIN.includes(spec)) continue;
    const name = packageName(spec);
    if (!(name in deps)) risks.set(name, name in dev ? 'devDependency' : 'missing');
  }
  const crashRisks = [...risks].map(([name, problem]) => ({ name, problem })).sort(byName);
  // 4.2 — npm ci fails when a declared range and the lockfile disagree
  const outOfSync = [];
  for (const [name, range] of [...Object.entries(deps), ...Object.entries(dev)]) {
    const entry = lock.packages[`node_modules/${name}`];
    const locked = entry ? entry.version : null;
    if (!locked || !satisfies(locked, range)) outOfSync.push({ name, range, locked });
  }
  outOfSync.sort(byName);
  // 4.3 — code that runs at install time, and names one keystroke from a famous one
  const scripts = new Set();
  for (const [key, entry] of Object.entries(lock.packages)) {
    if (key === '' || !entry.hasInstallScript) continue;
    const name = key.slice(key.lastIndexOf('node_modules/') + 13);
    if (!allowScripts.includes(name)) scripts.add(name);
  }
  const installScripts = [...scripts].sort();
  const typosquats = [];
  for (const name of [...Object.keys(deps), ...Object.keys(dev)]) {
    if (popular.includes(name)) continue;
    const like = popular.find((p) => distance(name, p) === 1);
    if (like) typosquats.push({ name, looksLike: like });
  }
  // outdated packages are information, never a reason to block a merge
  const outdatedRows = outdated(lock, registry);
  const fail = crashRisks.length || outOfSync.length || installScripts.length || typosquats.length;
  return { verdict: fail ? 'fail' : 'pass', crashRisks, outOfSync, installScripts, typosquats, outdated: outdatedRows };
}
const POP = ['express', 'lodash', 'cross-env', 'axios', 'react', 'dotenv', 'zod', 'prisma'];
const LOCK_PR = {
  lockfileVersion: 3,
  packages: {
    '': { name: 'notes-api', dependencies: { express: '^5.0.0', '@prisma/client': '^5.20.0', expres: '^4.18.0' }, devDependencies: { eslint: '^9.10.0', dotenv: '^16.4.5' } },
    'node_modules/express': { version: '4.18.0' }, 'node_modules/@prisma/client': { version: '5.22.0', hasInstallScript: true },
    'node_modules/@prisma/engines': { version: '5.22.0', hasInstallScript: true }, 'node_modules/expres': { version: '4.18.0', hasInstallScript: true },
    'node_modules/eslint': { version: '9.12.0' }, 'node_modules/dotenv': { version: '16.4.7' },
  },
};
const E3 = nodeBai({
  ten: 'Lab 4 · 3 — The dependency review bot', kho: 'HARD', phut: 40, dangBai: 'lab',
  en: `<p><b>Brief.</b> Write <code>reviewDependencies({ lock, imports, registry, allowScripts, popular })</code> — the bot that comments on every pull request. The declared packages are the lockfile root’s <code>dependencies</code> and <code>devDependencies</code> (that is package.json, copied by npm). It returns:</p>
<table><thead><tr><th>field</th><th>rule (lesson)</th></tr></thead><tbody>
<tr><td><code>crashRisks</code></td><td>imports of <code>src/</code> that are not in dependencies: <code>{ name, problem: "devDependency" | "missing" }</code>, by name — same rules as 4.1 (skip <code>./ ../ / node:</code> and the core modules <code>assert buffer child_process crypto events fs fs/promises http https os path readline stream string_decoder url util zlib</code>)</td></tr>
<tr><td><code>outOfSync</code></td><td>declared packages whose locked version is missing or does not satisfy the range (npm ci would fail): <code>{ name, range, locked }</code> (<code>locked</code> = version or <code>null</code>), by name — 4.2</td></tr>
<tr><td><code>installScripts</code></td><td>names with <code>hasInstallScript</code> not in <code>allowScripts</code>, sorted — 4.3</td></tr>
<tr><td><code>typosquats</code></td><td>declared names (dependencies first, then devDependencies) at edit distance 1 from a <code>popular</code> name: <code>{ name, looksLike }</code> — 4.3</td></tr>
<tr><td><code>outdated</code></td><td>the rows of Lab 4 · 2 — information only</td></tr>
<tr><td><code>verdict</code></td><td><code>"fail"</code> if any of the first four lists is non-empty, else <code>"pass"</code></td></tr></tbody></table>
<p>Provided: <code>compareVersions</code>, <code>satisfies</code>, <code>maxSatisfying</code>, <code>distance</code>, <code>packageName</code>, and <code>outdated</code>.</p>`,
  vi: `<p><b>Đề.</b> Viết <code>reviewDependencies({ lock, imports, registry, allowScripts, popular })</code> — con bot bình luận vào mọi pull request. Các gói được khai là <code>dependencies</code> và <code>devDependencies</code> của gốc lockfile (chính là package.json, npm chép sang). Nó trả về:</p>
<table><thead><tr><th>trường</th><th>luật (bài)</th></tr></thead><tbody>
<tr><td><code>crashRisks</code></td><td>import của <code>src/</code> không có trong dependencies: <code>{ name, problem: "devDependency" | "missing" }</code>, theo tên — cùng luật 4.1 (bỏ <code>./ ../ / node:</code> và các module lõi <code>assert buffer child_process crypto events fs fs/promises http https os path readline stream string_decoder url util zlib</code>)</td></tr>
<tr><td><code>outOfSync</code></td><td>gói đã khai mà phiên bản khoá thiếu hoặc không thoả khoảng (npm ci sẽ thất bại): <code>{ name, range, locked }</code> (<code>locked</code> = phiên bản hoặc <code>null</code>), theo tên — 4.2</td></tr>
<tr><td><code>installScripts</code></td><td>tên có <code>hasInstallScript</code> không nằm trong <code>allowScripts</code>, đã sắp — 4.3</td></tr>
<tr><td><code>typosquats</code></td><td>tên đã khai (dependencies trước, rồi devDependencies) cách một tên trong <code>popular</code> đúng một phép sửa: <code>{ name, looksLike }</code> — 4.3</td></tr>
<tr><td><code>outdated</code></td><td>các hàng của Lab 4 · 2 — chỉ để thông báo</td></tr>
<tr><td><code>verdict</code></td><td><code>"fail"</code> nếu một trong bốn danh sách đầu không rỗng, ngược lại <code>"pass"</code></td></tr></tbody></table>
<p>Có sẵn: <code>compareVersions</code>, <code>satisfies</code>, <code>maxSatisfying</code>, <code>distance</code>, <code>packageName</code>, và <code>outdated</code>.</p>`,
  dauVao: ['{ lock, imports, registry, allowScripts, popular }', '{ lock, imports, registry, allowScripts, popular }'], dauRa: ['{ verdict, crashRisks, outOfSync, installScripts, typosquats, outdated }', '{ verdict, crashRisks, outOfSync, installScripts, typosquats, outdated }'],
  yc: [['Each list follows the exact shape and order in the table.', 'Mỗi danh sách theo đúng dạng và thứ tự trong bảng.'], ['outdated never changes the verdict.', 'outdated không bao giờ đổi verdict.']],
  goiY: [['Write it as four small blocks, one per lesson, each producing one list — then the verdict is one line.', 'Viết thành bốn khối nhỏ, mỗi bài một khối, mỗi khối ra một danh sách — verdict chỉ còn một dòng.'], ['outOfSync walks deps then dev, but is sorted by name at the end.', 'outOfSync đi qua deps rồi dev, nhưng cuối cùng sắp theo tên.'], ['Reuse the provided outdated() as-is.', 'Dùng lại outdated() có sẵn y nguyên.']],
  loi: [['Failing the PR because a package is outdated — that is noise, and people learn to ignore the bot.', 'Đánh trượt PR vì một gói đã cũ — đó là tiếng ồn, và mọi người học cách phớt lờ bot.'], ['Checking typosquats on the imports instead of the declared names: the typo is in package.json.', 'Soát typosquat trên các import thay vì tên đã khai: chỗ gõ nhầm nằm trong package.json.'], ['Treating a missing lockfile entry as fine.', 'Coi việc thiếu mục lockfile là ổn.']],
  gt: ['The sample PR fails on all four counts at once: <code>expres</code> (typosquat, with an install script), <code>express</code> bumped to <code>^5.0.0</code> while the lock still says 4.18.0 (npm ci would fail), and <code>dotenv</code> imported by src/ but declared as a devDependency. None of those is caught by <code>tsc</code> or by tests that run on a machine where everything is installed — which is why the checks live in a bot.', 'PR mẫu trượt cả bốn tiêu chí cùng lúc: <code>expres</code> (typosquat, có install script), <code>express</code> nâng lên <code>^5.0.0</code> trong khi lock vẫn ghi 4.18.0 (npm ci sẽ thất bại), và <code>dotenv</code> được src/ import nhưng khai là devDependency. Không lỗi nào trong số đó bị <code>tsc</code> hay test chạy trên máy đã cài đủ mọi thứ bắt được — vì thế các phép kiểm nằm trong một con bot.'],
  kn: ['npm', 'security', 'CI'], tns: [tn('verdict', 'kết luận'), tn('CI bot', 'bot chạy trong CI')],
  chung: `${DATA}
const POP = ${JSON.stringify(POP)};
const LOCK_PR = ${JSON.stringify(LOCK_PR)};`,
  dau: `${HELPERS}
${nguon(outdated)}
/** the PR bot: one list per lesson, then a verdict */
function reviewDependencies({ lock, imports, registry, allowScripts, popular }) {
  // Write your solution here
  return { verdict: 'pass', crashRisks: [], outOfSync: [], installScripts: [], typosquats: [], outdated: outdated(lock, registry) };
}
`,
  giai: `${HELPERS}
${nguon(outdated)}
// Reference solution — one block per lesson, outdated is information only
${nguon(reviewDependencies)}`,
  cases: [
    { goi: 'reviewDependencies({ lock: LOCK_PR, imports: ["express", "@prisma/client", "dotenv", "./app.js", "node:path"], registry: REG, allowScripts: ["@prisma/client", "@prisma/engines"], popular: POP })', moTa: ['The sample pull request', 'Pull request mẫu'] },
    { goi: 'reviewDependencies({ lock: LOCK_A, imports: ["express", "@prisma/client/edge", "zod", "fs"], registry: REG, allowScripts: ["@prisma/client", "@prisma/engines"], popular: POP })', moTa: ['A clean PR passes (outdated rows do not block)', 'PR sạch thì qua (hàng outdated không chặn)'] },
    { goi: 'reviewDependencies({ lock: LOCK_A, imports: ["express"], registry: REG, allowScripts: [], popular: POP }).installScripts', an: true },
    { goi: 'reviewDependencies({ lock: { packages: { "": { dependencies: { axois: "^1.0.0", zod: "^3.24.1" }, devDependencies: { lodash: "^4.0.0" } }, "node_modules/zod": { version: "3.24.1" } } }, imports: ["axois", "lodash/fp", "crypto", "../x.js", "chalk"], registry: { axois: { versions: ["1.0.0"], latest: "1.0.0" }, zod: REG.zod, lodash: { versions: ["4.17.21"], latest: "4.17.21" } }, allowScripts: [], popular: POP })', an: true },
    { goi: 'reviewDependencies({ lock: LOCK_PR, imports: [], registry: REG, allowScripts: ["@prisma/client", "@prisma/engines", "expres"], popular: POP }).verdict', an: true },
  ],
});

export default doiDau({ slug: 'nodejs-4-lab-dependency-review', ten: 'Lab 4 — A dependency review bot for pull requests', khoa: KHOA, baiHoc: 'nodejs-4-3-bao-mat-npm', de: [E1, E2, E3] });
