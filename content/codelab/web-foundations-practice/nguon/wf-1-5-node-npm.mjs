/** Bộ luyện bài 1.5 — Node & npm. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Máy chấm không có npm/mạng ⇒ viết bằng JS phần "bộ não" của npm: đọc và so phiên bản, khoảng ^ ~ >= *, chọn bản lớn nhất
 *  thoả khoảng, npm start/test/run làm gì, đếm phụ thuộc bắc cầu, và tự sinh một tệp lock từ registry giả. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 1.5 — Node &amp; npm.</em> Mỗi bài là một việc npm làm khi bạn gõ <code>npm install</code> hay <code>npm run</code> — viết lại để hiểu ^1.11.13, node_modules và package-lock.json.</p>';

export default doiDau({
  slug: 'wf-1-5-node-npm',
  ten: '1.5 Node & npm',
  baiHoc: 'Nền tảng Web — Bài 1.5 Node & npm',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Đọc và so sánh phiên bản semver, kiểm khoảng ^ ~ >= * x (kể cả ^0.x), chọn bản lớn nhất thoả khoảng, mô phỏng npm start/test/run và "Missing script", đếm phụ thuộc bắc cầu như "added 29 packages", và tự sinh package-lock từ một registry giả — 6 bài.',
  de: [
    {
      tieuDe: 'Đọc và so sánh phiên bản',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['semver MAJOR.MINOR.PATCH'], tienQuyet: ['regex', 'sort'], the: ['javascript', 'npm'],
      moTa: `${BAI}<p>Viết ${c('parseVersion(v)')} cho ${c('"1.11.13"')} ⇒ ${c('{ major: 1, minor: 11, patch: 13 }')} (cho phép tiền tố ${c('v')}: ${c('"v22.23.3"')}); sai định dạng (thiếu phần, chữ, số âm, số 0 đứng đầu như ${c('"01.2.3"')}) ⇒ ${c('null')}. Viết ${c('compareVersions(a, b)')} trả số âm/0/dương — so SỐ từng phần, không so chuỗi — để dùng được với ${c('sort')}.</p>`,
      yeuCau: ['Ba phần số.', 'Không số 0 đứng đầu.', 'So theo số.'],
      dauVao: 'v: string.', dauRa: 'object | null; number.',
      rangBuoc: ['Không cần pre-release (-beta).'],
      viDu: [{ input: '["1.10.0", "1.9.0", "1.11.13"].sort(compareVersions)', output: '["1.9.0", "1.10.0", "1.11.13"]', explanation: 'So chuỗi sẽ đặt "1.10.0" trước "1.9.0".' }],
      goiY: ['/^v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)$/', 'return A.major - B.major || A.minor - B.minor || A.patch - B.patch;'],
      khoiDau: { 'main.js': `// Bài 1.5 — đọc và so phiên bản
function parseVersion(v) {
  const [major, minor, patch] = v.split('.');
  return { major, minor, patch };
}
function compareVersions(a, b) {
  return a < b ? -1 : 1;
}
` },
      loiGiai: { 'main.js': `// Bài 1.5 — MAJOR.MINOR.PATCH là ba SỐ; so lần lượt từng phần
const SEMVER = /^v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)$/;

function parseVersion(v) {
  const m = SEMVER.exec(String(v).trim());
  return m ? { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]) } : null;
}

function compareVersions(a, b) {
  const A = parseVersion(a), B = parseVersion(b);
  return A.major - B.major || A.minor - B.minor || A.patch - B.patch;
}
` },
      giaiThich: `<p>So chuỗi đặt ${c('"1.10.0"')} trước ${c('"1.9.0"')} vì ký tự "1" &lt; "9" — đúng loại lỗi sort mặc định ở Bài 10.4. Semver là ba số, so lần lượt.</p>`,
      loiHayGap: ['So chuỗi.', 'Để các phần là chuỗi.', 'Nhận "1.2".'],
      thamKhao: 'https://semver.org/',
      kiem: [
        { moTa: 'Parse valid versions|||Đọc phiên bản hợp lệ', goi: '[parseVersion("1.11.13"), parseVersion("v22.23.3"), parseVersion("0.0.0")]', mongDoi: [{ major: 1, minor: 11, patch: 13 }, { major: 22, minor: 23, patch: 3 }, { major: 0, minor: 0, patch: 0 }] },
        { moTa: 'Reject bad versions|||Từ chối phiên bản sai', goi: '["1.2", "1.2.x", "01.2.3", "1.-2.3", "latest"].map(parseVersion)', mongDoi: [null, null, null, null, null] },
        { moTa: 'Sort numerically|||Sắp theo số', goi: '["1.10.0", "1.9.0", "1.11.13", "0.20.1", "1.11.2"].sort(compareVersions)', mongDoi: ['0.20.1', '1.9.0', '1.10.0', '1.11.2', '1.11.13'] },
      ],
    },
    {
      tieuDe: 'npm start, npm test, npm run',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['npm scripts', 'đối số sau --'], tienQuyet: ['object', 'mảng'], the: ['javascript', 'npm'],
      moTa: `${BAI}<p>Viết ${c('npmCommand(pkg, argv)')} với ${c('argv')} là các đối số sau chữ ${c('npm')} (vd ${c('["start", "--", "Minh"]')}). Trả lệnh shell sẽ chạy: ${c('start')}/${c('test')} chạy thẳng script cùng tên; ${c('run <tên>')} (hoặc ${c('run-script')}) chạy script đó; ${c('run')} không tên ⇒ trả danh sách ${c('"Scripts: a, b, c"')} (tên sắp xếp). Mọi thứ sau ${c('--')} nối vào cuối lệnh, cách nhau dấu cách. Thiếu script ⇒ ném ${c('Error(\'Missing script: "<tên>"\')')}. Đặc biệt: ${c('start')} không có script mà có ${c('main')} ⇒ ${c('"node <main>"')}.</p>`,
      yeuCau: ['start/test không cần run.', 'Đối số sau --.', 'Missing script.', 'start mặc định.'],
      dauVao: 'pkg: object; argv: string[].', dauRa: 'string.',
      rangBuoc: ['pkg.scripts có thể vắng.'],
      viDu: [{ input: 'npmCommand({ scripts: { start: "node index.js" } }, ["start", "--", "Minh"])', output: '"node index.js Minh"', explanation: 'npm start -- Minh trong bài.' }],
      goiY: ['const i = argv.indexOf("--"); const extra = i < 0 ? [] : argv.slice(i + 1); const head = i < 0 ? argv : argv.slice(0, i);', 'const name = head[0] === "run" || head[0] === "run-script" ? head[1] : head[0];'],
      khoiDau: { 'main.js': `// Bài 1.5 — npm start / test / run
function npmCommand(pkg, argv) {
  return pkg.scripts[argv[1]];
}
` },
      loiGiai: { 'main.js': `// Bài 1.5 — npm chỉ tra tên trong "scripts" rồi chạy chuỗi lệnh đó, cộng đối số sau "--"
function npmCommand(pkg, argv) {
  const scripts = pkg.scripts ?? {};
  const i = argv.indexOf('--');
  const head = i < 0 ? argv : argv.slice(0, i);
  const extra = i < 0 ? [] : argv.slice(i + 1);
  const isRun = head[0] === 'run' || head[0] === 'run-script';
  if (isRun && head[1] === undefined) return 'Scripts: ' + Object.keys(scripts).sort().join(', ');
  const name = isRun ? head[1] : head[0];
  let cmd = scripts[name];
  if (cmd === undefined && name === 'start' && pkg.main) cmd = 'node ' + pkg.main;
  if (cmd === undefined) throw new Error('Missing script: "' + name + '"');
  return [cmd, ...extra].join(' ');
}
` },
      giaiThich: `<p>Scripts chỉ là bảng tên → lệnh. Vì mọi dự án dùng cùng tên (${c('start')}, ${c('dev')}, ${c('test')}, ${c('build')}), bạn khởi động được dự án của người khác mà không cần đọc mã. ${c('npm run')} không tên là lệnh đầu tiên nên gõ khi mở một dự án lạ.</p>`,
      loiHayGap: ['Bắt npm run start mới chạy.', 'Bỏ đối số sau --.', 'Quên start mặc định.'],
      thamKhao: 'https://docs.npmjs.com/cli/v10/commands/npm-run-script',
      kiem: [
        { moTa: 'start, test, run dev|||start, test, run dev', goi: '(() => { const p = { scripts: { start: "node index.js", dev: "nodemon index.js", test: "node --test" } }; return [npmCommand(p, ["start", "--", "Minh"]), npmCommand(p, ["test"]), npmCommand(p, ["run", "dev"]), npmCommand(p, ["run"])]; })()', mongDoi: ['node index.js Minh', 'node --test', 'nodemon index.js', 'Scripts: dev, start, test'] },
        { moTa: 'Missing script|||Thiếu script', goi: 'npmCommand({ scripts: { start: "node index.js" } }, ["run", "strat"])', mongDoi: { loi: 'Error', thongDiep: '^Missing script: "strat"$' } },
        { moTa: 'start falls back to main|||start lùi về main', goi: '[npmCommand({ main: "server.js" }, ["start"]), (() => { try { npmCommand({}, ["test"]); } catch (e) { return e.message; } })()]', mongDoi: ['node server.js', 'Missing script: "test"'] },
      ],
    },
    {
      tieuDe: 'Khoảng phiên bản ^ ~ >= *',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['caret', 'tilde', '^0.x'], tienQuyet: ['so sánh phiên bản'], the: ['javascript', 'npm'],
      moTa: `${BAI}<p>Viết ${c('satisfies(version, range)')}. Khoảng: ${c('"1.2.3"')} (đúng bản đó); ${c('"*"')} hoặc ${c('""')} (mọi bản); ${c('">=1.2.3"')}; ${c('"~1.2.3"')} (≥ 1.2.3 và &lt; 1.3.0); ${c('"^1.2.3"')} (≥ 1.2.3 và &lt; 2.0.0) — nhưng nếu major là 0 thì ${c('"^0.2.3"')} = &lt; 0.3.0, và ${c('"^0.0.3"')} = &lt; 0.0.4; ${c('"1.x"')} (cùng major), ${c('"1.2.x"')} (cùng major.minor). Viết lại ${c('parseVersion')}/so sánh bên trong. Khoảng không hiểu ⇒ ném ${c('TypeError("invalid range: <range>")')}.</p>`,
      yeuCau: ['Sáu dạng khoảng.', '^0.x đặc biệt.', 'Khoảng sai ⇒ lỗi.'],
      dauVao: 'version, range: string.', dauRa: 'boolean.',
      rangBuoc: ['Không cần khoảng ghép (">=1 <2", "||").'],
      viDu: [{ input: '["1.11.23", "1.12.0", "2.0.0"].map((v) => satisfies(v, "^1.11.13"))', output: '[true, true, false]', explanation: 'Đúng bảng semver trong bài.' }],
      goiY: ['Đổi mỗi khoảng thành [min, maxExclusive] rồi so: cmp(v, min) >= 0 && (!max || cmp(v, max) < 0).', '^: major > 0 ⇒ max = (major+1).0.0; major = 0, minor > 0 ⇒ 0.(minor+1).0; còn lại ⇒ 0.0.(patch+1).'],
      khoiDau: { 'main.js': `// Bài 1.5 — khoảng phiên bản
function satisfies(version, range) {
  return version === range.replace(/[\\^~]/, '');
}
` },
      loiGiai: { 'main.js': `// Bài 1.5 — mỗi khoảng là một đoạn [min, max) trên trục phiên bản
const V = /^v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)$/;
const parse = (s) => { const m = V.exec(s); return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null; };
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

function bounds(range) {
  const r = range.trim();
  if (r === '' || r === '*') return [[0, 0, 0], null];
  let m;
  if ((m = /^(\\d+)\\.x$/.exec(r))) return [[+m[1], 0, 0], [+m[1] + 1, 0, 0]];
  if ((m = /^(\\d+)\\.(\\d+)\\.x$/.exec(r))) return [[+m[1], +m[2], 0], [+m[1], +m[2] + 1, 0]];
  const op = /^(>=|\\^|~)?(.*)$/.exec(r);
  const v = parse(op[2]);
  if (!v) return null;
  switch (op[1]) {
    case '>=': return [v, null];
    case '~': return [v, [v[0], v[1] + 1, 0]];
    case '^': return [v, v[0] > 0 ? [v[0] + 1, 0, 0] : v[1] > 0 ? [0, v[1] + 1, 0] : [0, 0, v[2] + 1]];
    default: return [v, [v[0], v[1], v[2] + 1]];      // đúng một bản
  }
}

function satisfies(version, range) {
  const b = bounds(range);
  if (!b) throw new TypeError('invalid range: ' + range);
  const v = parse(version);
  if (!v) return false;
  return cmp(v, b[0]) >= 0 && (b[1] === null || cmp(v, b[1]) < 0);
}
` },
      giaiThich: `<p>${c('^')} nghĩa "không đổi số đầu tiên KHÁC 0": với 1.x, minor/patch mới được coi là tương thích; với 0.x, chính minor đã có thể phá vỡ, nên ${c('^0.2.3')} khoá vào 0.2.x. Tệp lock vẫn ghim bản chính xác — khoảng chỉ quyết định lần cài/cập nhật kế tiếp được phép lấy gì.</p>`,
      loiHayGap: ['^0.2.3 cho phép 0.3.0.', '~ cho phép minor mới.', 'Không ném lỗi với "latest".'],
      thamKhao: 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json#dependencies',
      kiem: [
        { moTa: 'The lesson\'s table|||Bảng trong bài', goi: '["1.11.13", "1.11.23", "1.12.0", "2.0.0", "1.11.12"].map((v) => [satisfies(v, "^1.11.13"), satisfies(v, "~1.11.13")])', mongDoi: [[true, true], [true, true], [true, false], [false, false], [false, false]] },
        { moTa: 'Caret on 0.x|||Dấu mũ với 0.x', goi: '[satisfies("0.2.9", "^0.2.3"), satisfies("0.3.0", "^0.2.3"), satisfies("0.0.3", "^0.0.3"), satisfies("0.0.4", "^0.0.3")]', mongDoi: [true, false, true, false] },
        { moTa: 'Exact, *, >=, x-ranges|||Đúng bản, *, >=, khoảng x', goi: '[satisfies("1.2.3", "1.2.3"), satisfies("1.2.4", "1.2.3"), satisfies("9.9.9", "*"), satisfies("3.0.0", ">=2.5.0"), satisfies("1.9.9", "1.x"), satisfies("1.3.0", "1.2.x")]', mongDoi: [true, false, true, true, true, false] },
        { moTa: 'Invalid range|||Khoảng sai', goi: 'satisfies("1.0.0", "latest")', mongDoi: { loi: 'TypeError', thongDiep: 'invalid range: latest' } },
      ],
    },
    {
      tieuDe: 'Bản lớn nhất thoả khoảng',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['npm install chọn bản nào'], tienQuyet: ['filter', 'sort'], the: ['javascript', 'npm'],
      moTa: `${BAI}<p>Khi cài, npm chọn bản MỚI NHẤT thoả khoảng. Viết ${c('maxSatisfying(versions, range)')} trả chuỗi phiên bản lớn nhất trong ${c('versions')} thoả ${c('range')} (cùng luật bài trước: đúng bản, *, >=, ~, ^ kể cả 0.x, x), hoặc ${c('null')}. Bỏ qua chuỗi không phải semver hợp lệ trong danh sách. Viết lại phần đọc/so phiên bản bên trong tệp.</p>`,
      yeuCau: ['Bản lớn nhất theo semver.', 'Bỏ chuỗi sai.', 'Không có ⇒ null.'],
      dauVao: 'versions: string[]; range: string.', dauRa: 'string | null.',
      rangBuoc: ['Danh sách không theo thứ tự.'],
      viDu: [{ input: 'maxSatisfying(["1.11.10", "1.11.13", "1.11.23", "2.0.0"], "^1.11.13")', output: '"1.11.23"', explanation: 'Vì sao npm install dayjs hôm nay ra 1.11.23 dù package.json ghi ^1.11.13 — nếu không có tệp lock.' }],
      goiY: ['versions.filter((v) => parse(v) && satisfies(v, range))', 'reduce giữ phần tử lớn nhất theo cmp.'],
      khoiDau: { 'main.js': `// Bài 1.5 — bản lớn nhất thoả khoảng
function maxSatisfying(versions, range) {
  return versions.sort().at(-1);
}
` },
      loiGiai: { 'main.js': `// Bài 1.5 — lọc theo khoảng, rồi lấy bản lớn nhất theo SEMVER (không theo chuỗi)
const V = /^v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)$/;
const parse = (s) => { const m = V.exec(s); return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null; };
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

function inRange(v, range) {
  const r = range.trim();
  if (r === '' || r === '*') return true;
  let m;
  if ((m = /^(\\d+)\\.x$/.exec(r))) return v[0] === +m[1];
  if ((m = /^(\\d+)\\.(\\d+)\\.x$/.exec(r))) return v[0] === +m[1] && v[1] === +m[2];
  const op = /^(>=|\\^|~)?(.*)$/.exec(r);
  const b = parse(op[2]);
  if (!b || cmp(v, b) < 0) return false;
  if (op[1] === '>=') return true;
  if (op[1] === '~') return v[0] === b[0] && v[1] === b[1];
  if (op[1] === '^') return b[0] > 0 ? v[0] === b[0] : b[1] > 0 ? v[0] === 0 && v[1] === b[1] : cmp(v, b) === 0;
  return cmp(v, b) === 0;
}

function maxSatisfying(versions, range) {
  let best = null;
  for (const s of versions) {
    const v = parse(s);
    if (v && inRange(v, range) && (!best || cmp(v, parse(best)) > 0)) best = s;
  }
  return best;
}
` },
      giaiThich: `<p>Đây là lý do cần tệp lock: cùng ${c('^1.11.13')}, hôm nay npm chọn 1.11.23, tháng sau có thể là 1.12.0. ${c('npm ci')} bỏ qua bước chọn này và lấy đúng bản đã ghi trong lock.</p>`,
      loiHayGap: ['sort() chuỗi.', 'Lấy bản lớn nhất bất kể khoảng.'],
      thamKhao: 'https://docs.npmjs.com/cli/v10/commands/npm-install',
      kiem: [
        { moTa: 'Newest matching version|||Bản mới nhất thoả', goi: '[maxSatisfying(["1.11.10", "1.11.13", "1.11.23", "2.0.0"], "^1.11.13"), maxSatisfying(["1.11.13", "1.11.23", "1.12.0"], "~1.11.13")]', mongDoi: ['1.11.23', '1.11.23'] },
        { moTa: 'Numeric, not string order|||Theo số, không theo chuỗi', goi: 'maxSatisfying(["1.9.0", "1.10.0", "1.2.0"], "1.x")', mongDoi: '1.10.0' },
        { moTa: 'No match; junk ignored; 0.x|||Không khớp; bỏ rác; 0.x', goi: '[maxSatisfying(["1.0.0"], "^2.0.0"), maxSatisfying(["latest", "0.2.5", "0.3.0", "x"], "^0.2.0"), maxSatisfying([], "*")]', mongDoi: [null, '0.2.5', null] },
      ],
    },
    {
      tieuDe: 'Một gói kéo theo bao nhiêu gói?',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['phụ thuộc bắc cầu', 'duyệt đồ thị'], tienQuyet: ['Set', 'đệ quy'], the: ['javascript', 'npm'],
      moTa: `${BAI}<p>${c('registry')} là object ${c('{ tên: { deps: [tên…] } }')} (đã phân giải phiên bản). Viết ${c('installTree(registry, wanted)')} với ${c('wanted')} là mảng gói bạn yêu cầu: trả ${c('{ packages, count, depth }')} — ${c('packages')} = mọi gói phải cài (kể cả gói yêu cầu), KHÔNG trùng, sắp theo tên; ${c('count')} = số đó; ${c('depth')} = chiều sâu lớn nhất (gói yêu cầu sâu 1). Có vòng (a → b → a) vẫn phải dừng. Gói không có trong registry ⇒ ném ${c('Error("404 Not Found: <tên>")')}.</p>`,
      yeuCau: ['Duyệt bắc cầu.', 'Không trùng, có vòng vẫn dừng.', 'Chiều sâu lớn nhất.'],
      dauVao: 'registry: object; wanted: string[].', dauRa: '{ packages, count, depth }.',
      rangBuoc: ['Chiều sâu tính theo đường NGẮN nhất tới mỗi gói (duyệt theo chiều rộng).'],
      viDu: [{ input: 'installTree(reg, ["nodemon"])', output: '{ count: 29, … }', explanation: '"added 29 packages" khi cài một công cụ, như trong bài.' }],
      goiY: ['Duyệt theo chiều rộng: queue = wanted.map((n) => [n, 1]); seen = new Map(tên → độ sâu).', 'if (!(name in registry)) throw new Error("404 Not Found: " + name);'],
      khoiDau: { 'main.js': `// Bài 1.5 — một gói kéo theo bao nhiêu gói?
function installTree(registry, wanted) {
  return { packages: wanted, count: wanted.length, depth: 1 };
}
` },
      loiGiai: { 'main.js': `// Bài 1.5 — duyệt theo chiều rộng; Map "đã thấy" vừa chống trùng vừa chống vòng
function installTree(registry, wanted) {
  const depthOf = new Map();
  const queue = wanted.map((name) => [name, 1]);
  while (queue.length) {
    const [name, d] = queue.shift();
    if (depthOf.has(name)) continue;
    if (!Object.hasOwn(registry, name)) throw new Error('404 Not Found: ' + name);
    depthOf.set(name, d);
    for (const dep of registry[name].deps ?? []) if (!depthOf.has(dep)) queue.push([dep, d + 1]);
  }
  const packages = [...depthOf.keys()].sort();
  return { packages, count: packages.length, depth: Math.max(0, ...depthOf.values()) };
}
` },
      giaiThich: `<p>Bạn ghi MỘT dòng trong package.json; npm cài cả cây. Các gói dùng chung chỉ cài một lần (dedupe) — đó là lý do số gói nhỏ hơn tổng số cạnh. Mỗi gói trong cây là mã của người khác chạy trên máy bạn: hãy nhìn ${c('npm ls --all')} trước khi tin một gói "nhỏ".</p>`,
      loiHayGap: ['Đệ quy không chống vòng ⇒ tràn ngăn xếp.', 'Đếm trùng gói dùng chung.', 'Chiều sâu theo DFS.'],
      thamKhao: 'https://docs.npmjs.com/cli/v10/commands/npm-ls',
      kiem: [
        { moTa: 'Shared deps installed once|||Gói dùng chung cài một lần', goi: 'installTree({ app: { deps: ["a", "b"] }, a: { deps: ["c"] }, b: { deps: ["c", "d"] }, c: { deps: [] }, d: { deps: ["c"] } }, ["a", "b"])', mongDoi: { packages: ['a', 'b', 'c', 'd'], count: 4, depth: 2 } },
        { moTa: 'One tool, many packages|||Một công cụ, nhiều gói', goi: '(() => { const reg = { nodemon: { deps: ["chokidar", "debug", "semver", "supports-color"] }, chokidar: { deps: ["anymatch", "braces", "glob-parent", "readdirp"] }, debug: { deps: ["ms"] }, ms: { deps: [] }, semver: { deps: [] }, "supports-color": { deps: ["has-flag"] }, "has-flag": { deps: [] }, anymatch: { deps: ["picomatch"] }, picomatch: { deps: [] }, braces: { deps: ["fill-range"] }, "fill-range": { deps: ["to-regex-range"] }, "to-regex-range": { deps: ["is-number"] }, "is-number": { deps: [] }, "glob-parent": { deps: ["is-glob"] }, "is-glob": { deps: ["is-extglob"] }, "is-extglob": { deps: [] }, readdirp: { deps: ["picomatch"] } }; const r = installTree(reg, ["nodemon"]); return [r.count, r.depth]; })()', mongDoi: [17, 6] },
        { moTa: 'Cycles stop; unknown package|||Vòng vẫn dừng; gói không tồn tại', goi: '[installTree({ a: { deps: ["b"] }, b: { deps: ["a"] } }, ["a"]).packages, (() => { try { installTree({ a: { deps: ["lefpad"] } }, ["a"]); } catch (e) { return e.message; } })()]', mongDoi: [['a', 'b'], '404 Not Found: lefpad'] },
      ],
    },
    {
      tieuDe: 'Tự sinh package-lock',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['phân giải phụ thuộc', 'tệp lock', 'xung đột phiên bản'], tienQuyet: ['semver', 'đệ quy'], the: ['javascript', 'npm'],
      moTa: `${BAI}<p>${c('registry')}: ${c('{ tên: { "<phiên bản>": { deps: { tên: khoảng } } } }')}. Viết ${c('makeLock(pkg, registry)')} với ${c('pkg = { dependencies?, devDependencies? }')} (khoảng như ${c('"^1.11.13"')}). Với mỗi phụ thuộc (dependencies trước, rồi devDependencies, mỗi nhóm theo tên), chọn bản LỚN NHẤT thoả khoảng (luật ^ ~ đúng bản như các bài trước), rồi phân giải đệ quy deps của bản đó. Mô hình PHẲNG: mỗi tên chỉ một bản; nếu tên đã được chọn và bản đó thoả khoảng mới ⇒ dùng lại; không thoả ⇒ ném ${c('Error("conflict: <tên> <bản đã chọn> does not satisfy <khoảng>")')}. Không bản nào thoả ⇒ ${c('Error("no matching version: <tên>@<khoảng>")')}. Trả object lock ${c('{ "node_modules/<tên>": { version, dev? } }')} sắp theo khoá; ${c('dev: true')} cho gói CHỈ cần bởi devDependencies.</p>`,
      yeuCau: ['Chọn bản lớn nhất thoả.', 'Đệ quy, dùng lại bản đã chọn.', 'Báo xung đột.', 'Đánh dấu dev.'],
      dauVao: 'pkg; registry.', dauRa: 'object lock.',
      rangBuoc: ['npm thật lồng node_modules khi xung đột; ở đây báo lỗi để thấy rõ xung đột.'],
      viDu: [{ input: 'makeLock({ dependencies: { dayjs: "^1.11.13" } }, { dayjs: { "1.11.13": { deps: {} }, "1.11.23": { deps: {} }, "2.0.0": { deps: {} } } })', output: '{ "node_modules/dayjs": { version: "1.11.23" } }', explanation: 'Bản lớn nhất thoả ^1.11.13.' }],
      goiY: ['resolve(name, range, isDev): nếu chosen.has(name) thì kiểm thoả; không thì chọn max và đệ quy deps.', 'Gói gặp ở nhánh dependencies thì dev = false mãi mãi; chỉ gặp ở nhánh dev thì dev = true.'],
      khoiDau: { 'main.js': `// Bài 1.5 — tự sinh package-lock
function makeLock(pkg, registry) {
  return {};
}
` },
      loiGiai: { 'main.js': `// Bài 1.5 — chọn bản lớn nhất thoả khoảng, đệ quy deps, mô hình phẳng: một tên = một bản
const V = /^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)$/;
const parse = (s) => { const m = V.exec(s); return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null; };
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
function ok(vs, range) {
  const v = parse(vs);
  const op = /^(\\^|~)?(.*)$/.exec(range.trim());
  const b = parse(op[2]);
  if (!v || !b || cmp(v, b) < 0) return false;
  if (op[1] === '~') return v[0] === b[0] && v[1] === b[1];
  if (op[1] === '^') return b[0] > 0 ? v[0] === b[0] : b[1] > 0 ? v[0] === 0 && v[1] === b[1] : cmp(v, b) === 0;
  return cmp(v, b) === 0;
}

function makeLock(pkg, registry) {
  const chosen = new Map();                                   // tên → { version, dev }
  function resolve(name, range, dev) {
    if (chosen.has(name)) {
      const c = chosen.get(name);
      if (!ok(c.version, range)) throw new Error('conflict: ' + name + ' ' + c.version + ' does not satisfy ' + range);
      if (!dev && c.dev) { c.dev = false; for (const [d, r] of Object.entries(registry[name][c.version].deps ?? {})) resolve(d, r, false); }
      return;
    }
    const versions = Object.keys(registry[name] ?? {}).filter((v) => ok(v, range));
    if (!versions.length) throw new Error('no matching version: ' + name + '@' + range);
    const version = versions.reduce((a, b) => (cmp(parse(b), parse(a)) > 0 ? b : a));
    chosen.set(name, { version, dev });
    for (const [d, r] of Object.entries(registry[name][version].deps ?? {})) resolve(d, r, dev);
  }
  for (const [n, r] of Object.entries(pkg.dependencies ?? {}).sort()) resolve(n, r, false);
  for (const [n, r] of Object.entries(pkg.devDependencies ?? {}).sort()) resolve(n, r, true);
  const lock = {};
  for (const name of [...chosen.keys()].sort()) {
    const c = chosen.get(name);
    lock['node_modules/' + name] = c.dev ? { version: c.version, dev: true } : { version: c.version };
  }
  return lock;
}
` },
      giaiThich: `<p>Đây là phần "phân giải" của ${c('npm install')}: khoảng trong package.json + danh sách bản trên registry ⇒ các bản CỤ THỂ, ghi vào ${c('package-lock.json')}. Gói chỉ dev được đánh dấu để ${c('npm ci --omit=dev')} bỏ qua chúng trên máy chủ. npm thật còn có thể cài hai bản của cùng một gói ở hai cấp node_modules để tránh xung đột — mô hình phẳng ở đây làm xung đột lộ ra rõ.</p>`,
      loiHayGap: ['Chọn bản đầu tiên thay vì lớn nhất.', 'Đệ quy lại gói đã chọn ⇒ lặp vô hạn.', 'Gói vừa dev vừa thường bị đánh dấu dev.'],
      thamKhao: 'https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json',
      kiem: [
        { moTa: 'Newest matching versions, recursively|||Bản mới nhất thoả, đệ quy', goi: 'makeLock({ dependencies: { dayjs: "^1.11.13", express: "^4.18.0" } }, { dayjs: { "1.11.13": { deps: {} }, "1.11.23": { deps: {} }, "2.0.0": { deps: {} } }, express: { "4.18.0": { deps: { ms: "^2.0.0" } }, "4.21.2": { deps: { ms: "~2.1.0" } }, "5.0.0": { deps: {} } }, ms: { "2.0.0": { deps: {} }, "2.1.2": { deps: {} }, "2.1.3": { deps: {} }, "3.0.0": { deps: {} } } })', mongDoi: { 'node_modules/dayjs': { version: '1.11.23' }, 'node_modules/express': { version: '4.21.2' }, 'node_modules/ms': { version: '2.1.3' } } },
        { moTa: 'Dev-only packages are marked|||Gói chỉ cho dev được đánh dấu', goi: 'makeLock({ dependencies: { debug: "^4.0.0" }, devDependencies: { nodemon: "^3.1.4" } }, { debug: { "4.3.7": { deps: { ms: "^2.1.3" } } }, nodemon: { "3.1.4": { deps: { debug: "^4.0.0", semver: "^7.5.3" } } }, ms: { "2.1.3": { deps: {} } }, semver: { "7.6.3": { deps: {} } } })', mongDoi: { 'node_modules/debug': { version: '4.3.7' }, 'node_modules/ms': { version: '2.1.3' }, 'node_modules/nodemon': { version: '3.1.4', dev: true }, 'node_modules/semver': { version: '7.6.3', dev: true } } },
        { moTa: 'Conflicts and missing versions|||Xung đột và thiếu phiên bản', goi: '(() => { const reg = { a: { "1.0.0": { deps: { c: "^1.0.0" } } }, b: { "1.0.0": { deps: { c: "^2.0.0" } } }, c: { "1.4.0": { deps: {} }, "2.1.0": { deps: {} } } }; const err = (p) => { try { makeLock(p, reg); } catch (e) { return e.message; } }; return [err({ dependencies: { a: "^1.0.0", b: "^1.0.0" } }), err({ dependencies: { c: "^3.0.0" } })]; })()', mongDoi: ['conflict: c 1.4.0 does not satisfy ^2.0.0', 'no matching version: c@^3.0.0'] },
      ],
    },
  ],
});
