/**
 * FER202 · 1.2 — Git, Node & npm: semver (^ ~) bằng JS, bảng lệnh npm, thứ tự quy trình Git.
 */
import { doiDau, KHOA, jsNho, lc, tinh } from './_chung.mjs';

const o = (ma, de, muc, dapAn, giaiThich) => ({ ma, de, muc: lc(...muc), dapAn, giaiThich });
const v = (...ds) => ds;

export default doiDau({
  slug: 'fer202-1-2-git-node-npm',
  ten: '1.2 Git, Node & npm',
  khoa: KHOA,
  baiHoc: 'fer202-1-2-git-node-npm',
  de: [
    jsNho({
      tieuDe: 'How npm reads ^ and ~ (semantic versioning)',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['semver MAJOR.MINOR.PATCH', 'caret range', 'tilde range'], the: ['npm', 'semver', 'javascript'],
      moTa: {
        en: '<p>In <code>package.json</code>, <code>"react": "^18.2.0"</code> does not mean exactly 18.2.0. Write <code>satisfies(version, range)</code> for three range forms: exact <code>1.2.3</code>, tilde <code>~1.2.3</code> (same MAJOR.MINOR, PATCH ≥ 3) and caret <code>^1.2.3</code> (same MAJOR, version ≥ 1.2.3). For MAJOR 0, caret behaves like tilde: <code>^0.2.3</code> allows only 0.2.x ≥ 0.2.3.</p>',
        vi: '<p>Trong <code>package.json</code>, <code>"react": "^18.2.0"</code> không có nghĩa đúng 18.2.0. Viết <code>satisfies(version, range)</code> cho ba dạng: chính xác <code>1.2.3</code>, dấu ngã <code>~1.2.3</code> (cùng MAJOR.MINOR, PATCH ≥ 3) và dấu mũ <code>^1.2.3</code> (cùng MAJOR, phiên bản ≥ 1.2.3). Khi MAJOR là 0, dấu mũ giống dấu ngã: <code>^0.2.3</code> chỉ cho 0.2.x ≥ 0.2.3.</p>',
      },
      yeuCau: [
        { en: 'Versions are plain <code>X.Y.Z</code> numbers (no pre-release tags). Compare numerically, not as strings.', vi: 'Phiên bản dạng <code>X.Y.Z</code> (không có nhãn pre-release). So sánh theo SỐ, không theo chuỗi.' },
        { en: 'Return <code>true</code>/<code>false</code>.', vi: 'Trả <code>true</code>/<code>false</code>.' },
      ],
      viDu: [{ input: 'satisfies("18.3.1", "^18.2.0")', output: 'true', explanation: 'Same major 18, and 18.3.1 ≥ 18.2.0.|||Cùng major 18, và 18.3.1 ≥ 18.2.0.' }],
      goiY: ['const parse = (s) => s.split(".").map(Number); const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];', 'Dấu mũ: major khác ⇒ false; major 0 ⇒ minor cũng phải bằng; rồi cmp(v, r) >= 0.'],
      loiHayGap: ['So chuỗi "18.10.0" < "18.9.0" ⇒ sai vì "1" < "9" theo ký tự.', 'Quên trường hợp ^0.x — nhiều thư viện 0.x đổi API ở bản minor.'],
      thuatNgu: [{ en: 'semantic versioning', vi: 'đánh số phiên bản MAJOR.MINOR.PATCH theo mức độ thay đổi' }, { en: 'breaking change', vi: 'thay đổi làm hỏng code cũ (tăng MAJOR)' }],
      giaiThich: '<p>MAJOR tăng khi phá tương thích, MINOR khi thêm tính năng, PATCH khi sửa lỗi. <code>^</code> cho phép cập nhật không phá vỡ; <code>package-lock.json</code> ghi lại phiên bản chính xác đã cài để mọi máy giống nhau.</p>',
      dau: `// main.js — STARTER
function satisfies(version, range) {
  return version === range.replace(/[\\^~]/, '');
}
`,
      giai: `// main.js — so khớp semver cho ba dạng: chính xác, ~ và ^
const parse = (s) => s.split('.').map(Number);
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

function satisfies(version, range) {
  const ver = parse(version);
  const op = range[0] === '^' || range[0] === '~' ? range[0] : '';
  const base = parse(op ? range.slice(1) : range);

  if (!op) return cmp(ver, base) === 0;
  if (cmp(ver, base) < 0) return false;
  if (ver[0] !== base[0]) return false; // khác MAJOR ⇒ không bao giờ khớp
  if (op === '~' || base[0] === 0) return ver[1] === base[1]; // ~ hoặc ^0.x ⇒ giữ nguyên MINOR
  return true; // ^ với MAJOR ≥ 1
}
`,
      kiem: [
        { moTa: 'Caret allows newer minor', goi: 'satisfies("18.3.1", "^18.2.0")', mongDoi: true },
        { moTa: 'Caret blocks a new major', goi: 'satisfies("19.0.0", "^18.2.0")', mongDoi: false },
        { moTa: 'Tilde allows only patches', goi: '[satisfies("1.2.9", "~1.2.3"), satisfies("1.3.0", "~1.2.3")]', mongDoi: [true, false] },
        { moTa: 'Exact', goi: '[satisfies("4.17.21", "4.17.21"), satisfies("4.17.20", "4.17.21")]', mongDoi: [true, false] },
        { an: true, moTa: 'Numeric, not string comparison', goi: 'satisfies("18.10.0", "^18.9.0")', mongDoi: true },
        { an: true, moTa: 'Older version fails', goi: 'satisfies("18.1.9", "^18.2.0")', mongDoi: false },
        { an: true, moTa: 'Caret on 0.x behaves like tilde', goi: '[satisfies("0.2.9", "^0.2.3"), satisfies("0.3.0", "^0.2.3")]', mongDoi: [true, false] },
      ],
    }),
    tinh({
      loai: 'table',
      tieuDe: 'npm and node commands',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['npm install', 'devDependencies', 'npm run', 'npx'], the: ['npm', 'table'],
      moTa: {
        en: '<p>Write the command for each task. Use the short forms you would type in a terminal (for example <code>npm i axios</code> is accepted for <code>npm install axios</code>).</p>',
        vi: '<p>Ghi lệnh cho mỗi việc. Dùng dạng bạn gõ trong terminal (ví dụ <code>npm i axios</code> được chấp nhận thay cho <code>npm install axios</code>).</p>',
      },
      bang: [{
        ma: 'c', de: 'Command for each task',
        cot: [{ ma: 'task', ten: 'Task' }, { ma: 'cmd', ten: 'Command' }],
        hang: [
          { ma: 'ver', o: { task: 'Show the installed Node.js version' } },
          { ma: 'init', o: { task: 'Create package.json with default answers' } },
          { ma: 'add', o: { task: 'Add axios as a dependency' } },
          { ma: 'dev', o: { task: 'Add json-server as a devDependency' } },
          { ma: 'all', o: { task: 'Install everything listed in package.json (after cloning)' } },
          { ma: 'start', o: { task: 'Run the "start" script' } },
          { ma: 'test', o: { task: 'Run the custom script "lint"' } },
        ],
        dapAn: {
          'ver.cmd': v('node -v', 'node --version'),
          'init.cmd': v('npm init -y', 'npm init --yes'),
          'add.cmd': v('npm install axios', 'npm i axios'),
          'dev.cmd': v('npm install -D json-server', 'npm i -D json-server', 'npm install --save-dev json-server', 'npm i --save-dev json-server'),
          'all.cmd': v('npm install', 'npm i', 'npm ci'),
          'start.cmd': v('npm start', 'npm run start'),
          'test.cmd': 'npm run lint',
        },
        giaiThich: 'start/test have shortcuts; any other script needs "npm run <name>". node_modules is never committed — "npm install" rebuilds it from package.json (+ lock file).|||start/test có lối tắt; script khác cần "npm run <tên>". node_modules không bao giờ commit — "npm install" dựng lại từ package.json (+ lock).',
      }],
      goiY: ['devDependency = chỉ cần khi phát triển: -D.', 'Script tự đặt tên phải chạy bằng npm run.'],
      loiHayGap: ['Commit thư mục node_modules lên Git.', 'Gõ <code>npm lint</code> ⇒ npm báo không có lệnh đó.'],
      giaiThich: '<p>package.json mô tả dự án và phụ thuộc; npm tải gói vào node_modules; scripts gom các lệnh hay dùng.</p>',
      thuatNgu: [{ en: 'dependency', vi: 'gói mà dự án cần để chạy' }, { en: 'devDependency', vi: 'gói chỉ cần lúc phát triển/kiểm thử' }],
    }),
    tinh({
      loai: 'order',
      tieuDe: 'Daily Git workflow',
      doKho: 'EASY', phut: 5,
      khaiNiem: ['working tree', 'staging area', 'commit', 'push'], the: ['git', 'order'],
      moTa: {
        en: '<p>You edited <code>App.js</code> and want the change on GitHub. Order the commands you run, starting from checking what changed.</p>',
        vi: '<p>Bạn đã sửa <code>App.js</code> và muốn thay đổi lên GitHub. Xếp các lệnh theo thứ tự, bắt đầu từ việc xem đã đổi gì.</p>',
      },
      goiY: ['Thay đổi phải vào staging (add) trước khi commit.', 'Push gửi các commit lên remote.'],
      loiHayGap: ['Push trước khi commit ⇒ "Everything up-to-date", không có gì lên.', 'Commit message kiểu "update" — không nói được đã đổi gì.'],
      giaiThich: '<p>status → diff → add → commit → push: xem, kiểm, chọn, ghi lại, chia sẻ.</p>',
      thuatNgu: [{ en: 'staging area', vi: 'khu chờ: những thay đổi sẽ vào commit kế tiếp' }],
      cauHoi: [
        o('g1', 'Order the commands', [
          ['d', '<code>git commit -m "feat: show course list"</code>'],
          ['a', '<code>git status</code>'],
          ['e', '<code>git push origin main</code>'],
          ['c', '<code>git add src/App.js</code>'],
          ['b', '<code>git diff</code>'],
        ], ['a', 'b', 'c', 'd', 'e'], 'Look → review → stage → commit → push.|||Xem → kiểm → chọn → ghi → đẩy.'),
      ],
    }),
  ],
});
