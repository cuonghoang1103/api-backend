/** Node.js 4.3 — An toàn chuỗi cung ứng: đếm cây phụ thuộc từ lockfile, gói có install script, tên gõ nhầm (typosquatting), dòng tóm tắt của npm audit. */
import { doiDau, KHOA, cs, q, tn, nodeBai, nguon, goi } from './_node-c3-5.mjs';

const E1 = cs({
  ten: '4.3 · Supply chain: what the lesson measured', kho: 'EASY', phut: 6,
  en: 'Questions on the lesson’s experiments: one dependency → 67 packages, a postinstall script that writes to your home folder, and <code>npm audit</code> on a pinned express 4.18.0.',
  vi: 'Các câu về thí nghiệm của bài: một dependency → 67 gói, một postinstall ghi file vào thư mục home, và <code>npm audit</code> trên express 4.18.0 đã ghim.',
  cau: [
    q('c1', ['<code>npm install ./harmless-package</code> created <code>~/.i-was-here.txt</code>, although nothing imported the package. How?', '<code>npm install ./harmless-package</code> tạo ra <code>~/.i-was-here.txt</code>, dù không ai import gói đó. Bằng cách nào?'],
      ['Its "postinstall" script ran automatically during npm install', 'npm imports every package once after installing it, to build a cache', 'The file was created by npm’s audit step, not by the package', 'node_modules/.bin added the package to PATH and the shell ran it'],
      ['Lifecycle scripts run at install time, before any import. A real attacker reads your environment variables, SSH keys or cloud credentials instead of writing a harmless file.', 'Lifecycle script chạy lúc cài, trước mọi import. Kẻ tấn công thật sẽ đọc biến môi trường, khoá SSH hay thông tin đăng nhập cloud thay vì ghi một file vô hại.']),
    q('c2', ['You turn on <code>--ignore-scripts</code> in CI. What might break?', 'Bạn bật <code>--ignore-scripts</code> trong CI. Cái gì có thể hỏng?'],
      ['Packages that compile native code at install time, like sharp, bcrypt or better-sqlite3', 'Every package that has a "test" script', 'npm ci itself, which needs scripts to read the lockfile', 'Nothing — install scripts are never needed'],
      ['Some legitimate packages need an install step to build or download a binary. Test before enforcing it globally, and allow those few explicitly.', 'Một số gói hợp lệ cần bước cài để biên dịch hay tải binary. Thử trước khi áp toàn bộ, và cho phép rõ ràng vài gói đó.']),
    q('c3', ['The lockfile pins express 4.18.0 and <code>npm audit</code> reports “7 vulnerabilities (3 low, 1 moderate, 3 high)”. Where are they?', 'Lockfile ghim express 4.18.0 và <code>npm audit</code> báo “7 vulnerabilities (3 low, 1 moderate, 3 high)”. Chúng nằm ở đâu?'],
      ['In dependencies of dependencies (send, serve-static…) — none in code we wrote', 'In our routes, because audit scans the src/ folder', 'In the lockfile format, which is outdated', 'In npm itself, which is older than the lockfile'],
      ['Pinning gives reproducibility, not immunity. A pinned tree left alone for two years is a museum of known vulnerabilities — update on a schedule.', 'Ghim cho khả năng tái lập, không cho miễn dịch. Một cây đã ghim để yên hai năm là bảo tàng các lỗ hổng đã biết — cập nhật theo lịch.']),
    q('c4', ['Why read before running <code>npm audit fix --force</code>?', 'Vì sao phải đọc trước khi chạy <code>npm audit fix --force</code>?'],
      ['It may install a new MAJOR version and break your app', 'It deletes the lockfile and cannot be undone', 'It uploads your package.json to the npm registry', 'It disables audit for the packages it fixed'],
      ['--force allows semver-major changes. Check what it wants to change, then test.', '--force cho phép đổi major. Xem nó định đổi gì, rồi test.']),
    q('c5', ['Historically, the most damaging npm incidents were…', 'Trong lịch sử, các sự cố npm gây hại nặng nhất là…'],
      ['A trusted package whose maintainer account was hijacked to ship a bad patch', 'A package so large that every CI job timed out while downloading it', 'A package chosen by mistake because it had no README or no license', 'A typo inside package.json that npm itself was unable to parse'],
      ['A caret range plus no lockfile means that patch reaches you automatically. The riskiest moment is not choosing a package — it is the update months later.', 'Dấu mũ cộng không có lockfile nghĩa là bản vá đó tự đến với bạn. Thời điểm rủi ro nhất không phải lúc chọn gói — mà là lần cập nhật vài tháng sau.']),
  ],
  goiY: [['Install ≠ import: think about what runs when.', 'Cài ≠ import: nghĩ xem cái gì chạy lúc nào.'], ['Reproducibility and safety are different properties.', 'Tái lập được và an toàn là hai tính chất khác nhau.']],
  loi: [['Believing a package can only act once you import it.', 'Tưởng gói chỉ hành động được khi bạn import nó.'], ['Treating a lockfile as a security guarantee.', 'Coi lockfile là bảo đảm an ninh.']],
  tns: [tn('supply chain', 'chuỗi cung ứng'), tn('lifecycle script', 'script vòng đời', 'preinstall / install / postinstall'), tn('advisory', 'bản tin lỗ hổng')],
  kn: ['npm', 'security'],
});

/* ─── 2. đếm cây từ lockfile ─── */
function nameFromKey(key) {
  // "node_modules/a/node_modules/@scope/b" → "@scope/b": the part after the LAST node_modules/
  return key.slice(key.lastIndexOf('node_modules/') + 'node_modules/'.length);
}
function treeStats(lock) {
  const root = lock.packages[''] || {};
  const declared = Object.keys(root.dependencies || {}).length + Object.keys(root.devDependencies || {}).length;
  const keys = Object.keys(lock.packages).filter((k) => k !== '');   // "" is the project itself
  const seen = {};
  for (const k of keys) {
    const name = nameFromKey(k);
    seen[name] = (seen[name] || 0) + 1;
  }
  // a name installed more than once = two versions of the same package in the tree
  const duplicated = Object.keys(seen).filter((n) => seen[n] > 1).sort();
  return { declared, installed: keys.length, duplicated };
}
const LOCK_EXPRESS = {
  name: 'npmdemo', lockfileVersion: 3, requires: true,
  packages: {
    '': { name: 'npmdemo', version: '1.0.0', dependencies: { express: '^4.18.0' } },
    'node_modules/express': { version: '4.18.0' }, 'node_modules/body-parser': { version: '1.20.0' }, 'node_modules/debug': { version: '2.6.9' },
    'node_modules/ms': { version: '2.0.0' }, 'node_modules/send': { version: '0.18.0' }, 'node_modules/send/node_modules/ms': { version: '2.1.3' },
    'node_modules/serve-static': { version: '1.15.0' }, 'node_modules/qs': { version: '6.10.3' }, 'node_modules/cookie': { version: '0.5.0' },
  },
};
const E2 = nodeBai({
  ten: '4.3 · Count the tree you really installed', kho: 'MEDIUM', phut: 15,
  en: `<p>“You approved one package. You installed sixty-seven.” The number that matters is in <code>package-lock.json</code> (lockfile v3): <code>packages</code> maps a path to an entry — <code>""</code> is the project itself, every other key is an installed package, e.g. <code>"node_modules/send/node_modules/ms"</code> (a second copy of <code>ms</code>, nested because <code>send</code> needs another version).</p>
<p>Write <code>treeStats(lock)</code> → <code>{ declared, installed, duplicated }</code>:</p>
<ul><li><code>declared</code> — number of entries in the root’s <code>dependencies</code> + <code>devDependencies</code>;</li><li><code>installed</code> — number of keys other than <code>""</code>;</li><li><code>duplicated</code> — package names installed more than once, sorted. The name is the part after the <b>last</b> <code>node_modules/</code> (it may be scoped: <code>@prisma/client</code>).</li></ul>`,
  vi: `<p>“Bạn duyệt một gói. Bạn cài sáu mươi bảy.” Con số quan trọng nằm trong <code>package-lock.json</code> (lockfile v3): <code>packages</code> ánh xạ một đường dẫn tới một mục — <code>""</code> là chính dự án, mọi khoá khác là một gói đã cài, vd <code>"node_modules/send/node_modules/ms"</code> (bản thứ hai của <code>ms</code>, lồng vào vì <code>send</code> cần phiên bản khác).</p>
<p>Viết <code>treeStats(lock)</code> → <code>{ declared, installed, duplicated }</code>:</p>
<ul><li><code>declared</code> — số mục trong <code>dependencies</code> + <code>devDependencies</code> của gốc;</li><li><code>installed</code> — số khoá khác <code>""</code>;</li><li><code>duplicated</code> — tên gói được cài nhiều hơn một lần, đã sắp xếp. Tên là phần sau <code>node_modules/</code> <b>cuối cùng</b> (có thể có scope: <code>@prisma/client</code>).</li></ul>`,
  dauVao: ['lock — a parsed package-lock.json (v3)', 'lock — package-lock.json đã parse (v3)'], dauRa: ['{ declared, installed, duplicated: string[] }', '{ declared, installed, duplicated: string[] }'],
  goiY: [['key.lastIndexOf("node_modules/") finds the start of the last segment — scopes need no special case.', 'key.lastIndexOf("node_modules/") tìm chỗ bắt đầu đoạn cuối — scope không cần xử lý riêng.'], ['Count names in an object, then keep those with a count above 1.', 'Đếm tên trong một object, rồi giữ những tên có số đếm lớn hơn 1.']],
  loi: [['Counting the "" entry as a package.', 'Đếm mục "" như một gói.'], ['Splitting the key on "/" and taking the last piece: "@prisma/client" becomes "client".', 'Tách khoá theo "/" rồi lấy mảnh cuối: "@prisma/client" thành "client".'], ['Reading only the root’s dependencies and calling that “the tree”.', 'Chỉ đọc dependencies của gốc rồi gọi đó là “cây”.']],
  gt: ['On the lockfile of this very website (measured 08/11/2026) the same function gives 899 installed packages. The lockfile is the honest list of what runs: <code>npm ls --all</code> prints the same tree, and a new unexplained key in a lockfile diff during code review is worth a question.', 'Trên lockfile của chính trang web này (đo 08/11/2026) cùng hàm đó cho 899 gói đã cài. Lockfile là danh sách trung thực những gì chạy: <code>npm ls --all</code> in ra cùng cây, và một khoá mới không rõ lý do trong diff lockfile lúc review code đáng để hỏi.'],
  kn: ['npm', 'lockfile'], tns: [tn('transitive dependency', 'phụ thuộc bắc cầu'), tn('nested copy', 'bản lồng', 'a second version installed under its parent')],
  chung: `const LOCK = ${JSON.stringify(LOCK_EXPRESS)};`,
  dau: `/** { declared, installed, duplicated } from a lockfile v3 */
function treeStats(lock) {
  // Write your solution here — this reads package.json's view, not the tree
  const root = lock.packages[''];
  const declared = Object.keys(root.dependencies || {}).length;
  return { declared, installed: declared, duplicated: [] };
}
`,
  giai: '// Reference solution — every key except "" is an installed package\n' + nguon(nameFromKey, treeStats),
  cases: [
    { goi: 'treeStats(LOCK)', moTa: ['One dependency, eight packages, ms twice', 'Một dependency, tám gói, ms hai lần'] },
    { goi: goi('treeStats', { lockfileVersion: 3, packages: { '': { name: 'empty' } } }), moTa: ['A project with no dependencies', 'Dự án không có dependency'] },
    { goi: goi('treeStats', { lockfileVersion: 3, packages: { '': { dependencies: { '@prisma/client': '^5' }, devDependencies: { prisma: '^5', eslint: '^9' } }, 'node_modules/@prisma/client': {}, 'node_modules/@prisma/engines': {}, 'node_modules/prisma': {}, 'node_modules/eslint': {}, 'node_modules/@eslint/eslintrc/node_modules/debug': {}, 'node_modules/debug': {}, 'node_modules/a/node_modules/@prisma/engines': {} } }), an: true },
    { goi: goi('treeStats', { lockfileVersion: 3, packages: { '': { dependencies: { x: '1' } }, 'node_modules/x': {}, 'node_modules/x/node_modules/y': {}, 'node_modules/z/node_modules/y': {}, 'node_modules/y': {} } }), an: true },
  ],
});

/* ─── 3. gói có install script ─── */
function installScripts(lock, allow) {
  const names = new Set();
  for (const [key, entry] of Object.entries(lock.packages)) {
    if (key === '' || !entry.hasInstallScript) continue;   // npm records this flag for preinstall/install/postinstall
    const name = key.slice(key.lastIndexOf('node_modules/') + 13);
    if (!allow.includes(name)) names.add(name);
  }
  return [...names].sort();
}
const SITE_LOCK = {
  lockfileVersion: 3,
  packages: {
    '': { name: 'api-backend' },
    'node_modules/@prisma/client': { version: '5.22.0', hasInstallScript: true }, 'node_modules/@prisma/engines': { version: '5.22.0', hasInstallScript: true },
    'node_modules/@xenova/transformers/node_modules/sharp': { version: '0.32.6', hasInstallScript: true }, 'node_modules/canvas': { version: '2.11.2', hasInstallScript: true },
    'node_modules/esbuild': { version: '0.25.0', hasInstallScript: true }, 'node_modules/fsevents': { version: '2.3.3', hasInstallScript: true },
    'node_modules/playwright/node_modules/fsevents': { version: '2.3.2', hasInstallScript: true }, 'node_modules/prisma': { version: '5.22.0', hasInstallScript: true },
    'node_modules/protobufjs': { version: '7.4.0', hasInstallScript: true }, 'node_modules/express': { version: '4.22.2' }, 'node_modules/sharp': { version: '0.35.3' },
    'node_modules/bcryptjs': { version: '2.4.3' },
  },
};
const E3 = nodeBai({
  ten: '4.3 · Which packages run code at install time?', kho: 'MEDIUM', phut: 12,
  en: `<p>“Install scripts run before you import anything — this is the step where a compromised package acts.” npm writes <code>"hasInstallScript": true</code> into the lockfile entry of every package that declares <code>preinstall</code>, <code>install</code> or <code>postinstall</code>. The lesson’s advice: <code>--ignore-scripts</code> in CI, and audit the few packages that genuinely need one.</p>
<p>Write <code>installScripts(lock, allow)</code>: the names of packages with <code>hasInstallScript</code> that are <b>not</b> in the <code>allow</code> list, without duplicates, sorted. The name is the part after the last <code>node_modules/</code>.</p><p>The sample is a real excerpt of this website’s own lockfile: 9 entries carry the flag.</p>`,
  vi: `<p>“Install script chạy trước khi bạn import bất cứ gì — đây là bước mà một gói bị chiếm quyền ra tay.” npm ghi <code>"hasInstallScript": true</code> vào mục lockfile của mọi gói khai báo <code>preinstall</code>, <code>install</code> hay <code>postinstall</code>. Lời khuyên của bài: <code>--ignore-scripts</code> trong CI, và soát kỹ vài gói thật sự cần.</p>
<p>Viết <code>installScripts(lock, allow)</code>: tên các gói có <code>hasInstallScript</code> mà <b>không</b> nằm trong danh sách <code>allow</code>, không trùng, đã sắp. Tên là phần sau <code>node_modules/</code> cuối cùng.</p><p>Dữ liệu mẫu là trích đoạn thật từ lockfile của chính trang web này: 9 mục mang cờ đó.</p>`,
  dauVao: ['lock — lockfile v3; allow — names you have reviewed', 'lock — lockfile v3; allow — các tên bạn đã soát'], dauRa: ['sorted array of package names', 'mảng tên gói đã sắp'],
  goiY: [['Object.entries(lock.packages), skip "" and entries without the flag.', 'Object.entries(lock.packages), bỏ "" và các mục không có cờ.'], ['A Set removes the second fsevents (nested under playwright).', 'Một Set loại fsevents thứ hai (lồng dưới playwright).']],
  loi: [['Returning the lockfile keys instead of package names.', 'Trả về khoá lockfile thay vì tên gói.'], ['Assuming a package without the flag in one place has none elsewhere: sharp appears twice, with and without it.', 'Tưởng gói không có cờ ở chỗ này thì chỗ khác cũng không: sharp xuất hiện hai lần, có và không có cờ.']],
  gt: ['On this site’s lockfile the unreviewed list is the honest to-do list before turning on <code>ignore-scripts</code>: Prisma downloads its engine, esbuild and canvas fetch native binaries, fsevents is macOS-only. Every other package gets to run no code at install time.', 'Trên lockfile của trang này, danh sách chưa soát là việc cần làm trung thực trước khi bật <code>ignore-scripts</code>: Prisma tải engine của nó, esbuild và canvas tải binary gốc, fsevents chỉ dành cho macOS. Mọi gói khác không được chạy chút code nào lúc cài.'],
  kn: ['npm', 'security'], tns: [tn('hasInstallScript', 'cờ “có script lúc cài” trong lockfile'), tn('allowlist', 'danh sách cho phép')],
  chung: `const SITE_LOCK = ${JSON.stringify(SITE_LOCK)};`,
  dau: `/** packages that run code at install time and are not on the allow list */
function installScripts(lock, allow) {
  // Write your solution here
  return Object.keys(lock.packages).filter((k) => lock.packages[k].hasInstallScript);
}
`,
  giai: '// Reference solution — read the flag npm writes, name from the last node_modules/\n' + nguon(installScripts),
  cases: [
    { goi: 'installScripts(SITE_LOCK, [])', moTa: ['This site’s excerpt, nothing reviewed', 'Trích đoạn của trang này, chưa soát gì'] },
    { goi: 'installScripts(SITE_LOCK, ["@prisma/client", "@prisma/engines", "prisma", "esbuild"])', moTa: ['After reviewing Prisma and esbuild', 'Sau khi soát Prisma và esbuild'] },
    { goi: goi('installScripts', { packages: { '': {}, 'node_modules/left-pad': { version: '1.3.0' } } }, []), an: true },
    { goi: goi('installScripts', { packages: { '': { hasInstallScript: true }, 'node_modules/a/node_modules/@evil/pkg': { hasInstallScript: true }, 'node_modules/@evil/pkg': { hasInstallScript: true }, 'node_modules/bcrypt': { hasInstallScript: true } } }, ['bcrypt']), an: true },
  ],
});

/* ─── 4. typosquatting ─── */
function distance(a, b) {
  // edit distance with adjacent swaps (optimal string alignment): insert, delete, replace, swap = 1 each
  const d = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}
function typosquatSuspects(names, popular) {
  const out = [];
  for (const name of names) {
    if (popular.includes(name)) continue;                  // the real thing
    const like = popular.find((p) => distance(name, p) === 1);
    if (like) out.push({ name, looksLike: like });          // one keystroke away from a famous package
  }
  return out;
}
const POPULAR = ['express', 'lodash', 'cross-env', 'axios', 'react', 'dotenv', 'chalk', 'prisma'];
const E4 = nodeBai({
  ten: '4.3 · Flag names one keystroke away from a famous package', kho: 'MEDIUM', phut: 20,
  en: `<p>“Typosquatting is real: <code>expres</code>, <code>lodahs</code>, <code>crossenv</code>. Copy the name from the official docs, never type it from memory.” Build the check a CI job could run on every new dependency. Write <code>typosquatSuspects(names, popular)</code>:</p>
<ul><li>skip a name that is itself in <code>popular</code>;</li><li>otherwise, if it is at <b>edit distance 1</b> from a popular name, report <code>{ name, looksLike }</code> (the first such popular name, in list order). One edit = insert one character, delete one, replace one, or <b>swap two neighbours</b> (<code>lodahs</code> ↔ <code>lodash</code>);</li><li>keep the order of <code>names</code>.</li></ul>`,
  vi: `<p>“Typosquatting là có thật: <code>expres</code>, <code>lodahs</code>, <code>crossenv</code>. Chép tên từ tài liệu chính thức, đừng gõ theo trí nhớ.” Dựng phép kiểm mà một job CI có thể chạy cho mọi dependency mới. Viết <code>typosquatSuspects(names, popular)</code>:</p>
<ul><li>bỏ qua tên chính là một tên trong <code>popular</code>;</li><li>ngược lại, nếu nó cách một tên nổi tiếng đúng <b>một phép sửa</b>, báo <code>{ name, looksLike }</code> (tên nổi tiếng đầu tiên như vậy, theo thứ tự danh sách). Một phép sửa = chèn một ký tự, xoá một, thay một, hoặc <b>đổi chỗ hai ký tự kề nhau</b> (<code>lodahs</code> ↔ <code>lodash</code>);</li><li>giữ thứ tự của <code>names</code>.</li></ul>`,
  dauVao: ['names — candidate package names; popular — well-known names', 'names — tên gói cần soát; popular — tên nổi tiếng'], dauRa: ['[{ name, looksLike }]', '[{ name, looksLike }]'],
  goiY: [['Write distance(a, b) with the classic dynamic-programming table (Levenshtein).', 'Viết distance(a, b) bằng bảng quy hoạch động kinh điển (Levenshtein).'], ['Add one more case for a swap: if a[i-1] === b[j-2] and a[i-2] === b[j-1], try d[i-2][j-2] + 1.', 'Thêm một trường hợp cho phép đổi chỗ: nếu a[i-1] === b[j-2] và a[i-2] === b[j-1], thử d[i-2][j-2] + 1.'], ['Without the swap rule, "lodahs" is at distance 2 from "lodash" and slips through.', 'Thiếu luật đổi chỗ, "lodahs" cách "lodash" 2 và lọt qua.']],
  loi: [['Comparing only same-length names: "expres" (deleted s) and "crossenv" (deleted -) are missed.', 'Chỉ so các tên cùng độ dài: "expres" (mất s) và "crossenv" (mất -) bị bỏ sót.'], ['Plain Levenshtein: a swapped pair costs 2, so "axois" is not flagged.', 'Levenshtein thuần: đổi chỗ một cặp tốn 2, nên "axois" không bị đánh dấu.'], ['Flagging the real "express" as a typo of itself (distance 0).', 'Đánh dấu chính "express" là gõ nhầm của nó (khoảng cách 0).']],
  gt: ['Edit distance 1 catches the lesson’s three examples (a deleted letter, a swapped pair, a deleted hyphen). It is a filter, not a verdict: a flagged name is a reason to open the npm page and compare downloads, maintainers and the repository link before installing.', 'Khoảng cách sửa 1 bắt được cả ba ví dụ của bài (mất một chữ, đảo một cặp, mất dấu gạch). Nó là bộ lọc, không phải phán quyết: tên bị đánh dấu là lý do mở trang npm và so lượt tải, người duy trì và link repository trước khi cài.'],
  kn: ['security', 'algorithms'], tns: [tn('typosquatting', 'đặt tên gói giống tên nổi tiếng để lừa gõ nhầm'), tn('edit distance', 'khoảng cách sửa', 'minimum single-character edits between two strings')],
  chung: `const POPULAR = ${JSON.stringify(POPULAR)};`,
  dau: `/** names at edit distance 1 from a popular package (insert, delete, replace, adjacent swap) */
function typosquatSuspects(names, popular) {
  // Write your solution here — this only catches one replaced letter
  const out = [];
  for (const name of names) {
    const like = popular.find((p) => p.length === name.length && p !== name && [...p].filter((ch, i) => ch !== name[i]).length === 1);
    if (like) out.push({ name, looksLike: like });
  }
  return out;
}
`,
  giai: '// Reference solution — edit distance with adjacent swaps\n' + nguon(distance, typosquatSuspects),
  cases: [
    { goi: 'typosquatSuspects(["expres", "lodahs", "crossenv"], POPULAR)', moTa: ['The lesson’s three examples', 'Ba ví dụ của bài'] },
    { goi: 'typosquatSuspects(["express", "zod", "fastify"], POPULAR)', moTa: ['Real or unrelated names are not flagged', 'Tên thật hoặc không liên quan không bị đánh dấu'] },
    { goi: 'typosquatSuspects(["axois", "reacts", "dotenvv", "chalk", "prisma-x"], POPULAR)', an: true },
    { goi: 'typosquatSuspects(["exprss", "lodashh", "cross_env", "ract"], POPULAR)', an: true },
    { goi: '[distance("lodahs", "lodash"), distance("expres", "express"), distance("crossenv", "cross-env"), distance("abc", "abc"), distance("", "ab")]', an: true },
  ],
});

/* ─── 5. dòng tóm tắt của npm audit ─── */
function auditSummary(vulns) {
  if (vulns.length === 0) return 'found 0 vulnerabilities';
  const order = ['low', 'moderate', 'high', 'critical'];
  const count = {};
  for (const v of vulns) count[v.severity] = (count[v.severity] || 0) + 1;
  const sevs = order.filter((s) => count[s] > 0);
  const lines = [];
  // several severities: "7 vulnerabilities (3 low, 1 moderate, 3 high)"; one: "3 high severity vulnerabilities"
  if (sevs.length > 1) lines.push(`${vulns.length} vulnerabilities (${sevs.map((s) => `${count[s]} ${s}`).join(', ')})`);
  else lines.push(`${count[sevs[0]]} ${sevs[0]} severity vulnerabilit${count[sevs[0]] === 1 ? 'y' : 'ies'}`);
  const fixable = vulns.some((v) => v.fixAvailable === true);
  const forceFixable = vulns.some((v) => typeof v.fixAvailable === 'object' && v.fixAvailable !== null);
  const breaking = vulns.some((v) => typeof v.fixAvailable === 'object' && v.fixAvailable && v.fixAvailable.isSemVerMajor);
  const unfixable = vulns.some((v) => v.fixAvailable === false);
  if (fixable) lines.push('', `To address ${forceFixable || unfixable ? 'issues that do not require attention' : 'all issues'}, run:\n  npm audit fix`);
  if (forceFixable) lines.push('', `To address all issues${unfixable ? ' possible' : ''}${breaking ? ' (including breaking changes)' : ''}, run:\n  npm audit fix --force`);
  if (unfixable) lines.push('', 'Some issues need review, and may require choosing', 'a different dependency.');
  return lines.join('\n');
}
const E5 = nodeBai({
  ten: '4.3 · Rebuild the summary npm audit prints', kho: 'HARD', phut: 25,
  en: `<p>The lesson’s <code>npm audit</code> ended with <code>7 vulnerabilities (3 low, 1 moderate, 3 high)</code>. That text is built by npm’s <code>npm-audit-report</code> (read in npm 10.9.9’s source). Rebuild it. <code>vulns</code> is one entry per vulnerable package: <code>{ name, severity: 'low'|'moderate'|'high'|'critical', fixAvailable }</code>, where <code>fixAvailable</code> is <code>true</code> (plain <code>npm audit fix</code> works), <code>false</code> (no fix), or <code>{ isSemVerMajor }</code> (only <code>--force</code> fixes it).</p>
<ol><li>none → <code>found 0 vulnerabilities</code> (and nothing else);</li><li>first line: two or more severities → <code>&lt;total&gt; vulnerabilities (&lt;n&gt; &lt;sev&gt;, …)</code> in the order low, moderate, high, critical, zero counts left out; one severity → <code>&lt;n&gt; &lt;sev&gt; severity vulnerability</code> (<code>vulnerabilities</code> if n &gt; 1);</li><li>if some fix is <code>true</code>: a blank line, then <code>To address all issues, run:\\n  npm audit fix</code> — but say <code>issues that do not require attention</code> instead of <code>all issues</code> when some are force-only or unfixable;</li><li>if some are force-only: blank line, <code>To address all issues[ possible][ (including breaking changes)], run:\\n  npm audit fix --force</code> — “ possible” when some are unfixable, the parenthesis when one of them is semver-major;</li><li>if some are unfixable: blank line, <code>Some issues need review, and may require choosing</code>, newline, <code>a different dependency.</code></li></ol><p>Join the lines with <code>\\n</code>.</p>`,
  vi: `<p><code>npm audit</code> của bài kết thúc bằng <code>7 vulnerabilities (3 low, 1 moderate, 3 high)</code>. Chuỗi đó do <code>npm-audit-report</code> của npm dựng (đọc trong mã nguồn npm 10.9.9). Hãy dựng lại. <code>vulns</code> là một mục mỗi gói có lỗ hổng: <code>{ name, severity: 'low'|'moderate'|'high'|'critical', fixAvailable }</code>, với <code>fixAvailable</code> là <code>true</code> (<code>npm audit fix</code> thường là đủ), <code>false</code> (không có bản sửa), hoặc <code>{ isSemVerMajor }</code> (chỉ <code>--force</code> sửa được).</p>
<ol><li>không có → <code>found 0 vulnerabilities</code> (và không gì khác);</li><li>dòng đầu: từ hai mức độ trở lên → <code>&lt;tổng&gt; vulnerabilities (&lt;n&gt; &lt;mức&gt;, …)</code> theo thứ tự low, moderate, high, critical, bỏ mức có số 0; một mức → <code>&lt;n&gt; &lt;mức&gt; severity vulnerability</code> (<code>vulnerabilities</code> nếu n &gt; 1);</li><li>nếu có bản sửa <code>true</code>: một dòng trống, rồi <code>To address all issues, run:\\n  npm audit fix</code> — nhưng nói <code>issues that do not require attention</code> thay cho <code>all issues</code> khi có cái chỉ sửa bằng force hoặc không sửa được;</li><li>nếu có cái chỉ sửa bằng force: dòng trống, <code>To address all issues[ possible][ (including breaking changes)], run:\\n  npm audit fix --force</code> — thêm “ possible” khi có cái không sửa được, thêm ngoặc khi một trong số đó là đổi major;</li><li>nếu có cái không sửa được: dòng trống, <code>Some issues need review, and may require choosing</code>, xuống dòng, <code>a different dependency.</code></li></ol><p>Nối các dòng bằng <code>\\n</code>.</p>`,
  dauVao: ['vulns — [{ name, severity, fixAvailable }]', 'vulns — [{ name, severity, fixAvailable }]'], dauRa: ['the summary text, exactly', 'đúng chuỗi tóm tắt'],
  goiY: [['Count per severity first, then build the first line from the severities with a non-zero count.', 'Đếm theo mức độ trước, rồi dựng dòng đầu từ các mức có số khác 0.'], ['Compute four booleans: fixable, forceFixable, breaking, unfixable — every later line depends only on them.', 'Tính bốn boolean: fixable, forceFixable, breaking, unfixable — mọi dòng sau chỉ phụ thuộc vào chúng.'], ['A blank line is an empty string pushed before each block; join("\\n") does the rest.', 'Dòng trống là một chuỗi rỗng push trước mỗi khối; join("\\n") làm phần còn lại.']],
  loi: [['"1 high severity vulnerabilities" — the plural depends on the count.', '"1 high severity vulnerabilities" — số nhiều phụ thuộc số đếm.'], ['Listing "0 critical" in the parenthesis.', 'Ghi "0 critical" trong ngoặc.'], ['Telling users to run --force without saying it includes breaking changes.', 'Bảo người dùng chạy --force mà không nói nó gồm thay đổi phá vỡ.']],
  gt: ['The rules are a transcription of <code>npm-audit-report/lib/reporters/install.js</code> in npm 10.9.9 (colours removed). Notice what the text is careful about: it only promises “all issues” when a plain fix covers everything, and it warns when <code>--force</code> means a breaking major — the lesson’s “read before you fix”, written into the tool.', 'Các luật là bản chép của <code>npm-audit-report/lib/reporters/install.js</code> trong npm 10.9.9 (bỏ màu). Để ý chuỗi cẩn thận ở đâu: nó chỉ hứa “all issues” khi bản sửa thường bao hết, và cảnh báo khi <code>--force</code> nghĩa là một major phá vỡ — đúng câu “đọc trước khi sửa” của bài, viết thẳng vào công cụ.'],
  kn: ['npm', 'security'], tns: [tn('severity', 'mức độ nghiêm trọng'), tn('semver-major', 'đổi phiên bản major (có thể phá vỡ)')],
  dau: `/** the summary block npm audit prints */
function auditSummary(vulns) {
  // Write your solution here
  return vulns.length + ' vulnerabilities';
}
`,
  giai: '// Reference solution — npm-audit-report\'s install reporter, without colours\n' + nguon(auditSummary),
  cases: [
    { goi: 'auditSummary([..."abc".split("").map((n) => ({ name: n, severity: "low", fixAvailable: { isSemVerMajor: true } })), { name: "m", severity: "moderate", fixAvailable: { isSemVerMajor: true } }, ..."xyz".split("").map((n) => ({ name: n, severity: "high", fixAvailable: { isSemVerMajor: true } }))])', moTa: ['The lesson’s 7 vulnerabilities (fix needs a major)', '7 lỗ hổng của bài (sửa cần đổi major)'] },
    { goi: 'auditSummary([])', moTa: ['Nothing found', 'Không có gì'] },
    { goi: 'auditSummary([{ name: "send", severity: "high", fixAvailable: true }])', moTa: ['One severity, one package, plain fix', 'Một mức, một gói, sửa thường'] },
    { goi: 'auditSummary([{ name: "a", severity: "high", fixAvailable: true }, { name: "b", severity: "high", fixAvailable: true }, { name: "c", severity: "high", fixAvailable: true }])', an: true },
    { goi: 'auditSummary([{ name: "a", severity: "critical", fixAvailable: false }, { name: "b", severity: "low", fixAvailable: true }, { name: "c", severity: "moderate", fixAvailable: { isSemVerMajor: false } }])', an: true },
    { goi: 'auditSummary([{ name: "a", severity: "moderate", fixAvailable: false }, { name: "b", severity: "moderate", fixAvailable: false }])', an: true },
    { goi: 'auditSummary([{ name: "a", severity: "low", fixAvailable: true }, { name: "b", severity: "high", fixAvailable: { isSemVerMajor: true } }])', an: true },
  ],
});

export default doiDau({ slug: 'nodejs-4-3-bao-mat-npm', ten: '4.3 Supply chain safety', khoa: KHOA, baiHoc: 'nodejs-4-3-bao-mat-npm', de: [E1, E2, E3, E4, E5] });
