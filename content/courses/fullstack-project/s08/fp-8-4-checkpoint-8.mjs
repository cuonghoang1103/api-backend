/**
 * 8.4 — Checkpoint 8: npm test chạy xanh với độ phủ có ý nghĩa (soạn 24/11/2026, agent fsp).
 * Output THẬT: scripts/checkpoint-8.mjs (23 tiêu chí, 24 khi gọi checkpoint-7 → 6 → … → 1 bằng Chrome 150 thật), Vitest 5.1.1,
 * @vitest/coverage-v8 5.1.1, Postgres 18 dùng một lần. Mã: nhánh ch8/test (chưa commit — tệp trong cây làm việc).
 * Phát hiện thật 24/11: độ phủ 77,7% → 92,25% dòng sau khi thêm test duyệt ảnh (kho giả) + API; một tệp test KHÔNG có expect
 * nào đạt 100% dòng/nhánh/hàm trên cursor.ts mà đột biến 'lt'→'lte' sống sót; checkpoint bản đầu với một it.only bị quên ⇒
 * bộ test đỏ sẵn ⇒ bước phá thử báo "bắt được" mọi lỗi (giả) ⇒ sửa: chỉ phá thử khi lần 1 xanh; xoá khẳng định 403 ở hai tệp ⇒
 * độ phủ vẫn 92,25% nhưng lỗi "ai cũng xoá được bình luận" lọt (bắt 7/8); bản chép sạch (không node_modules, không .env) ⇒ npm ci
 * ⇒ 106/106.
 * Nguồn: không có sự cố bảo mật mới trong bài này (đã dẫn CrowdStrike 2024 ở 8.1, GitLab 2017 ở 8.2, Peloton 2021 ở 8.3).
 */
import { lienKet, spring } from '../_chung.mjs';

const SCRIPTS = `    "typecheck": "tsc -p tsconfig.json --noEmit &amp;&amp; tsc -p tsconfig.test.json",
    "test": "vitest run",
    "test:unit": "vitest run --project unit",
    "test:watch": "vitest --project unit",
    "test:cov": "vitest run --coverage",`;

const PHU_DAU = ` % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   77.71 |    66.13 |   80.62 |   79.64 |                   
 src               |      90 |    85.71 |     100 |   94.73 |                   
  config.ts        |   77.77 |    85.71 |     100 |    87.5 | 12                
 src/controllers   |   73.17 |        0 |   63.63 |   71.05 |                   
  ...controller.ts |      50 |      100 |      50 |      40 | 8,16-17           
  ...controller.ts |       0 |        0 |       0 |       0 | 6-7               
  ...controller.ts |       0 |      100 |       0 |       0 | 6                 
  ...controller.ts |       0 |      100 |       0 |       0 | 5-9               
  ...controller.ts |   88.88 |      100 |     100 |    87.5 | 28                
  ...controller.ts |       0 |      100 |       0 |       0 | 5                 
  ...controller.ts |      50 |      100 |      50 |      50 | 9                 
 src/db            |      50 |       25 |       0 |   57.14 |                   
  prisma.ts        |      50 |       25 |       0 |   57.14 | 27-29             
 src/lib           |   98.11 |    85.71 |     100 |     100 |                   
  storage.ts       |     100 |       50 |     100 |     100 | 19                
  tokens.ts        |   92.85 |       75 |     100 |     100 | 27                
 src/middlewares   |   98.48 |       82 |     100 |     100 |                   
  error-handler.ts |     100 |       90 |     100 |     100 | 31                
  log-request.ts   |     100 |       50 |     100 |     100 | 14-15             
  rate-limit.ts    |     100 |       50 |     100 |     100 | 8                 
  require-auth.ts  |     100 |       90 |     100 |     100 | 13                
  validate.ts      |   94.73 |       70 |     100 |     100 | 15-24,34          
 src/realtime      |   72.88 |    65.38 |   76.92 |   80.85 |                   
  index.ts         |   72.88 |    65.38 |   76.92 |   80.85 | 47-52,85-86,99    
 src/schemas       |   94.44 |      100 |     100 |   94.44 |                   
  error.schema.ts  |       0 |      100 |     100 |       0 | 5                 
 src/services      |   66.25 |    59.71 |      75 |   66.16 |                   
  auth.service.ts  |   93.02 |    88.46 |     100 |   97.22 | 64                
  ...th.service.ts |    8.33 |        0 |       0 |    9.09 | 8-22              
  image.service.ts |   12.76 |      3.7 |   14.28 |    12.5 | 20-24,33-98       
  info.service.ts  |       0 |      100 |       0 |       0 | 3                 
  like.service.ts  |   96.96 |      100 |     100 |   96.29 | 54                
  post.service.ts  |      75 |    63.04 |   94.44 |   75.51 | ...31,135,142,145 
  ...ad.service.ts |      20 |      100 |       0 |      20 | 12-24             
  user.service.ts  |   42.85 |       25 |      50 |      50 | 13-15             
-------------------|---------|----------|---------|---------|-------------------
=============================== Coverage summary ===============================
Statements   : 77.71% ( 408/525 )
Branches     : 66.13% ( 166/251 )
Functions    : 80.62% ( 104/129 )
Lines        : 79.64% ( 360/452 )
================================================================================`;

const PHU = `      Tests  106 passed (106)
   Start at  23:36:35
   Duration  8.61s (tests 35%, import 32%, transform 19%, setup 12%, worker 3%)
 % Coverage report from v8
------------------------|---------|----------|---------|---------|-----------------------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                 
------------------------|---------|----------|---------|---------|-----------------------------------
All files               |   90.28 |    79.28 |   95.34 |   92.25 |                                   
 src                    |      90 |    85.71 |     100 |   94.73 |                                   
  config.ts             |   77.77 |    85.71 |     100 |    87.5 | 12                                
 src/controllers        |   95.12 |       50 |   95.45 |   94.73 |                                   
  health.controller.ts  |     100 |       50 |     100 |     100 | 7-8                               
  info.controller.ts    |       0 |      100 |       0 |       0 | 6                                 
  post.controller.ts    |   88.88 |      100 |     100 |    87.5 | 28                                
 src/db                 |      50 |       25 |       0 |   57.14 |                                   
  prisma.ts             |      50 |       25 |       0 |   57.14 | 27-29                             
 src/lib                |   98.11 |    85.71 |     100 |     100 |                                   
  storage.ts            |     100 |       50 |     100 |     100 | 19                                
  tokens.ts             |   92.85 |       75 |     100 |     100 | 27                                
 src/middlewares        |     100 |       84 |     100 |     100 |                                   
  error-handler.ts      |     100 |       90 |     100 |     100 | 31                                
  log-request.ts        |     100 |       50 |     100 |     100 | 14-15                             
  rate-limit.ts         |     100 |       50 |     100 |     100 | 8                                 
  require-auth.ts       |     100 |       90 |     100 |     100 | 13                                
  validate.ts           |     100 |       80 |     100 |     100 | 15-24                             
 src/realtime           |   72.88 |    65.38 |   76.92 |   80.85 |                                   
  index.ts              |   72.88 |    65.38 |   76.92 |   80.85 | 47-52,85-86,99                    
 src/schemas            |   94.44 |      100 |     100 |   94.44 |                                   
  error.schema.ts       |       0 |      100 |     100 |       0 | 5                                 
 src/services           |   89.58 |    81.29 |   98.07 |    90.4 |                                   
  auth.service.ts       |   93.02 |    88.46 |     100 |   97.22 | 64                                
  health.service.ts     |     100 |    85.71 |     100 |     100 | 18                                
  image.service.ts      |   89.36 |    81.48 |     100 |    87.5 | 37-38,52,55-56                    
  info.service.ts       |       0 |      100 |       0 |       0 | 3                                 
  like.service.ts       |   96.96 |      100 |     100 |   96.29 | 54                                
  post.service.ts       |   76.56 |    63.04 |     100 |   77.55 | 78-79,118-121,130-131,135,142,145 
------------------------|---------|----------|---------|---------|-----------------------------------
=============================== Coverage summary ===============================
Statements   : 90.28% ( 474/525 )
Branches     : 79.28% ( 199/251 )
Functions    : 95.34% ( 123/129 )
Lines        : 92.25% ( 417/452 )
================================================================================`;

const GIA_VO = `import { it } from 'vitest';
import { maHoaCursor, giaiMaCursor, catTrang, dieuKienSau } from '../../src/lib/cursor.js';

// TEST GIẢ VỜ: gọi mọi hàm, đi qua mọi nhánh — và KHÔNG khẳng định điều gì.
it('cursor chạy được', () =&gt; {
  const v = { id: '00000000-0000-4000-8000-000000000001', createdAt: new Date() };
  giaiMaCursor(maHoaCursor(v));
  try {
    giaiMaCursor('hong');
  } catch {}
  catTrang([v, v], 1);
  catTrang([], 1);
  dieuKienSau(v, 'desc');
  dieuKienSau(v, 'asc');
});`;

const GIA_VO_BANG = `total                dòng 100%  nhánh 100%  hàm 100%
src/lib/cursor.ts    dòng 100%  nhánh 100%  hàm 100%`;

const GIA_VO_PHU = ` Test Files  1 passed (1)
      Tests  1 passed (1)
--- sau khi đổi 'lt' thành 'lte' trong dieuKienSau (trang sau LẶP lại phần tử cuối trang trước):
gia-vo.test.ts:        Tests  1 passed (1)
cursor.test.ts:       × feed (giảm dần): createdAt &lt;= t VÀ (createdAt &lt; t HOẶC cùng t mà id nhỏ hơn) 12ms
cursor.test.ts:       × bình luận (tăng dần): đảo hết dấu so sánh 2ms
cursor.test.ts:        Tests  2 failed | 8 passed (10)`;

const SCRIPT = `// Checkpoint 8 — tự chấm bộ test của API: "npm test" xanh trên máy sạch (KHÔNG cần .env, KHÔNG cần Postgres dev — test tự
// bật Postgres dùng một lần), đủ ba tầng (unit / tích hợp / API), độ phủ qua ngưỡng, KHÔNG chập chờn, không để lại container,
// và quan trọng nhất: bộ test BẮT ĐƯỢC LỖI — script cài lần lượt 8 lỗi thật vào mã, mỗi lỗi phải làm test đỏ.
// Cần: Docker đang chạy (test tự bật container), Node ≥ 22.12. Chạy ở gốc repo:  node scripts/checkpoint-8.mjs
//   --bo-cp7 : bỏ qua bước gọi checkpoint-7 (cần Postgres + MinIO dev + Chrome) khi chỉ sửa test.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, mkdtempSync, rmSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
let dat = 0;
let truot = 0;
const kiem = (moTa, dung) =&gt; {
  console.log(\`  \${dung ? '✔' : '✘'} \${moTa}\`);
  dung ? dat++ : truot++;
};
const laWin = process.platform === 'win32';
const API = 'apps/api';
// Chạy vitest, trả { ok, soTest, soTep, giay, ra }. NO_COLOR: đọc được kết quả bằng regex.
function chayTest(thuMuc = API, thamSo = []) {
  const t0 = Date.now();
  const r = spawnSync('npx', ['vitest', 'run', ...thamSo], {
    cwd: thuMuc,
    encoding: 'utf8',
    shell: laWin,
    env: { ...process.env, NO_COLOR: '1', CI: '1' },
  });
  const ra = r.stdout + r.stderr;
  const so = (re) =&gt; Number(ra.match(re)?.[1] ?? 0);
  return {
    ok: r.status === 0,
    soDat: so(/Tests\\s+(?:\\d+ failed \\| )?(\\d+) passed/),
    soTruot: so(/Tests\\s+(\\d+) failed/),
    giay: (Date.now() - t0) / 1000,
    ra,
  };
}
const containerTest = () =&gt;
  spawnSync('docker', ['ps', '-aq', '--filter', 'name=fsp-pg-test-'], { encoding: 'utf8' }).stdout.trim();
const tepTest = (thuMuc) =&gt;
  readdirSync(thuMuc, { recursive: true })
    .filter((t) =&gt; String(t).endsWith('.test.ts'))
    .map((t) =&gt; join(thuMuc, String(t)));

if (!process.argv.includes('--bo-cp7')) {
  console.log('== 0. Checkpoint 7 vẫn đạt');
  const cp7 = spawnSync(process.execPath, ['scripts/checkpoint-7.mjs'], { encoding: 'utf8' });
  kiem(\`checkpoint-7: \${cp7.stdout.trim().split('\\n').at(-1)}\`, cp7.status === 0);
}

console.log('== 1. Bộ test: cấu trúc và vệ sinh');
const tatCaTep = tepTest(\`\${API}/test\`);
const noiDung = Object.fromEntries(tatCaTep.map((t) =&gt; [t, readFileSync(t, 'utf8')]));
const soTep = (thu) =&gt; tatCaTep.filter((t) =&gt; t.includes(\`/test/\${thu}/\`)).length;
kiem(
  \`đủ ba tầng: unit \${soTep('unit')} tệp, tích hợp \${soTep('tich-hop')} tệp, API \${soTep('api')} tệp (mỗi tầng ≥ 2)\`,
  ['unit', 'tich-hop', 'api'].every((t) =&gt; soTep(t) &gt;= 2),
);
const coOnly = tatCaTep.filter((t) =&gt;
  /\\b(it|test|describe)\\.(only|skip|todo)\\b|\\bx(it|describe)\\(/.test(noiDung[t]),
);
kiem(
  \`không còn .only / .skip / .todo bị quên\${coOnly.length ? ': ' + coOnly.join(', ') : ''}\`,
  coOnly.length === 0,
);
const khongExpect = tatCaTep.filter((t) =&gt; !/\\bexpect\\(|\\.expect\\(\\d/.test(noiDung[t]));
kiem(
  \`mọi tệp test đều có khẳng định (expect)\${khongExpect.length ? ' — KHÔNG có: ' + khongExpect.join(', ') : ''}\`,
  khongExpect.length === 0,
);
const moiTruong = readFileSync(\`\${API}/test/moi-truong.ts\`, 'utf8');
kiem(
  'test KHÔNG đọc .env của máy dev (không loadEnvFile/dotenv trong test/)',
  !Object.values(noiDung)
    .concat(moiTruong)
    .some((s) =&gt; /loadEnvFile|dotenv/.test(s)),
);
const tc = spawnSync('npm', ['run', 'typecheck', '-w', API], { encoding: 'utf8', shell: laWin });
kiem(
  'typecheck gồm cả thư mục test (tsconfig.test.json)',
  tc.status === 0 &amp;&amp; /tsconfig\\.test\\.json/.test(tc.stdout),
);

console.log('== 2. npm test xanh, ổn định, tự dọn');
const truocDo = containerTest();
const lan = [chayTest(), chayTest(), chayTest()];
const l1 = lan[0];
kiem(\`lần 1: \${l1.soDat} test đạt, \${l1.soTruot} trượt, \${l1.giay.toFixed(1)} s\`, l1.ok &amp;&amp; l1.soDat &gt;= 100);
kiem(
  \`chạy 3 lần liền: \${lan.map((l) =&gt; (l.ok ? 'xanh' : \`ĐỎ (\${l.soTruot})\`)).join(' · ')} — không chập chờn\`,
  lan.every((l) =&gt; l.ok),
);
kiem(
  \`mỗi lần &lt; 60 s (\${lan.map((l) =&gt; l.giay.toFixed(1)).join(' / ')} s)\`,
  lan.every((l) =&gt; l.giay &lt; 60),
);
kiem('không để lại container fsp-pg-test-* sau khi chạy', containerTest() === truocDo);

console.log('== 3. Độ phủ qua ngưỡng đã đặt trong vitest.config.ts');
const phu = chayTest(API, ['--coverage', '--coverage.reporter=text-summary']);
const dong = phu.ra.match(/Lines\\s*:\\s*([\\d.]+)%/)?.[1];
kiem(\`npm run test:cov: dòng \${dong ?? '?'}% — ngưỡng không bị hạ dưới 85%\`, phu.ok &amp;&amp; Number(dong) &gt;= 85);
const cfg = readFileSync(\`\${API}/vitest.config.ts\`, 'utf8');
const nguong = Number(cfg.match(/lines:\\s*(\\d+)/)?.[1] ?? 0);
kiem(\`vitest.config.ts có thresholds (lines: \${nguong})\`, nguong &gt;= 85);

console.log('== 4. Phá thử: 8 lỗi thật, mỗi lỗi phải làm test ĐỎ');
// [mô tả, tệp, đoạn đúng, đoạn lỗi]. Mỗi đột biến là một bug ĐÃ TỪNG được bàn ở chương trước.
const DOT_BIEN = [
  [
    'ai cũng xoá được bình luận của người khác (5.1)',
    'src/services/comment.service.ts',
    'where: { id, OR: [{ authorId: nguoiLam }, { post: { authorId: nguoiLam } }] },',
    'where: { id },',
  ],
  [
    'refresh song song: bỏ điều kiện revokedAt = null (3.2)',
    'src/services/auth.service.ts',
    'where: { id: rt.id, revokedAt: null },',
    'where: { id: rt.id },',
  ],
  [
    'IDOR: sửa bài không kiểm tác giả (4.1)',
    'src/services/post.service.ts',
    'where: { id, authorId: nguoiLam },\\n      data:',
    'where: { id },\\n      data:',
  ],
  [
    'quên requireAuth ở DELETE /comments/:id (3.3)',
    'src/routes/index.ts',
    "apiRouter.delete('/comments/:id', requireAuth, validateIdParam,",
    "apiRouter.delete('/comments/:id', validateIdParam,",
  ],
  [
    'lỗi 500 lộ chi tiết cho client (2.3)',
    'src/middlewares/error-handler.ts',
    "gui(500, 'LOI_MAY_CHU', 'Có lỗi phía máy chủ');",
    "gui(500, 'LOI_MAY_CHU', String(err));",
  ],
  [
    'cursor dùng &lt;= thay vì &lt; ⇒ trang sau lặp bài (5.2)',
    'src/lib/cursor.ts',
    "const hon = chieu === 'desc' ? 'lt' : 'gt';",
    "const hon = chieu === 'desc' ? 'lte' : 'gte';",
  ],
  [
    'bỏ giới hạn điểm ảnh ⇒ bom giải nén lọt (4.3)',
    'src/services/image.service.ts',
    'sharp(du, { limitInputPixels: DIEM_ANH_TOI_DA })',
    'sharp(du, { limitInputPixels: false })',
  ],
  [
    'mật khẩu không chuẩn hoá NFC ⇒ gõ tiếng Việt máy khác sai (3.1)',
    'src/lib/password.ts',
    "const chuan = (matKhau: string) =&gt; matKhau.normalize('NFC');",
    'const chuan = (matKhau: string) =&gt; matKhau;',
  ],
];
const banGoc = new Map();
const traLai = () =&gt; {
  for (const [tep, s] of banGoc) writeFileSync(tep, s);
  banGoc.clear();
};
process.once('SIGINT', () =&gt; (traLai(), process.exit(130))); // Ctrl+C giữa chừng vẫn trả mã về như cũ
let bat = 0;
// Bộ test ĐANG ĐỎ sẵn thì phá gì cũng "đỏ" ⇒ mọi đột biến đều trông như bị bắt (bản đầu của script mắc đúng lỗi này:
// phá thử bằng một it.only bị quên ⇒ bước 4 vẫn báo "bắt được"). Chỉ phá thử khi bộ test đang xanh.
if (!l1.ok) kiem('bỏ qua phá thử — bộ test phải XANH trước thì "đỏ sau khi phá" mới có nghĩa', false);
try {
  for (const [moTa, tepTuongDoi, dung, sai] of l1.ok ? DOT_BIEN : []) {
    const tep = join(API, tepTuongDoi);
    const goc = readFileSync(tep, 'utf8');
    if (!goc.includes(dung)) {
      kiem(\`\${moTa}: không tìm thấy đoạn mã cần phá trong \${tepTuongDoi} (mã đã đổi? sửa DOT_BIEN)\`, false);
      continue;
    }
    banGoc.set(tep, goc);
    writeFileSync(tep, goc.replace(dung, sai));
    const r = chayTest();
    traLai();
    if (!r.ok) bat++;
    kiem(\`\${moTa} ⇒ \${r.ok ? 'test VẪN XANH — lỗi lọt!' : \`\${r.soTruot} test đỏ\`}\`, !r.ok);
  }
} finally {
  traLai();
}
const sach = spawnSync('git', ['diff', '--quiet', '--', \`\${API}/src\`]).status === 0;
kiem(\`bắt \${bat}/\${DOT_BIEN.length} lỗi; mã nguồn đã trả về nguyên trạng (git diff src/ rỗng)\`, sach);

console.log('== 5. Máy sạch: bản chép không node_modules, không .env ⇒ npm ci ⇒ npm test');
const tam = mkdtempSync(join(tmpdir(), 'chiase-cp8-'));
try {
  cpSync('.', tam, {
    recursive: true,
    filter: (p) =&gt;
      !/(^|[\\\\/])(node_modules|\\.git|coverage|dist|\\.env)$/.test(p) &amp;&amp; !/[\\\\/]src[\\\\/]generated/.test(p),
  });
  kiem('bản chép không có apps/api/.env', !existsSync(join(tam, API, '.env')));
  const ci = spawnSync('npm', ['ci', '--no-audit', '--no-fund'], {
    cwd: tam,
    encoding: 'utf8',
    shell: laWin,
  });
  kiem(
    \`npm ci trên bản chép (\${ci.status === 0 ? 'xong' : 'LỖI: ' + ci.stderr.split('\\n').slice(-3).join(' ')})\`,
    ci.status === 0,
  );
  const r = chayTest(join(tam, API));
  kiem(
    \`npm test trên bản chép: \${r.soDat} đạt, \${r.soTruot} trượt (\${r.giay.toFixed(1)} s)\`,
    r.ok &amp;&amp; r.soDat === l1.soDat,
  );
} finally {
  rmSync(tam, { recursive: true, force: true });
}

console.log(\`\\nCheckpoint 8: \${dat}/\${dat + truot} tiêu chí đạt\${truot ? \` — \${truot} trượt\` : ''}\`);
process.exit(truot === 0 ? 0 : 1);`;

const CP_1 = `== 1. Bộ test: cấu trúc và vệ sinh
  ✔ đủ ba tầng: unit 8 tệp, tích hợp 3 tệp, API 6 tệp (mỗi tầng ≥ 2)
  ✔ không còn .only / .skip / .todo bị quên
  ✔ mọi tệp test đều có khẳng định (expect)
  ✔ test KHÔNG đọc .env của máy dev (không loadEnvFile/dotenv trong test/)
  ✔ typecheck gồm cả thư mục test (tsconfig.test.json)
== 2. npm test xanh, ổn định, tự dọn
  ✔ lần 1: 106 test đạt, 0 trượt, 14.3 s
  ✔ chạy 3 lần liền: xanh · xanh · xanh — không chập chờn
  ✔ mỗi lần &lt; 60 s (14.3 / 10.9 / 11.3 s)
  ✔ không để lại container fsp-pg-test-* sau khi chạy
== 3. Độ phủ qua ngưỡng đã đặt trong vitest.config.ts
  ✔ npm run test:cov: dòng 92.25% — ngưỡng không bị hạ dưới 85%
  ✔ vitest.config.ts có thresholds (lines: 90)
== 4. Phá thử: 8 lỗi thật, mỗi lỗi phải làm test ĐỎ
  ✔ ai cũng xoá được bình luận của người khác (5.1) ⇒ 2 test đỏ
  ✔ refresh song song: bỏ điều kiện revokedAt = null (3.2) ⇒ 3 test đỏ
  ✔ IDOR: sửa bài không kiểm tác giả (4.1) ⇒ 2 test đỏ
  ✔ quên requireAuth ở DELETE /comments/:id (3.3) ⇒ 2 test đỏ
  ✔ lỗi 500 lộ chi tiết cho client (2.3) ⇒ 1 test đỏ
  ✔ cursor dùng &lt;= thay vì &lt; ⇒ trang sau lặp bài (5.2) ⇒ 4 test đỏ
  ✔ bỏ giới hạn điểm ảnh ⇒ bom giải nén lọt (4.3) ⇒ 1 test đỏ
  ✔ mật khẩu không chuẩn hoá NFC ⇒ gõ tiếng Việt máy khác sai (3.1) ⇒ 1 test đỏ
  ✔ bắt 8/8 lỗi; mã nguồn đã trả về nguyên trạng (git diff src/ rỗng)
== 5. Máy sạch: bản chép không node_modules, không .env ⇒ npm ci ⇒ npm test
  ✔ bản chép không có apps/api/.env
  ✔ npm ci trên bản chép (xong)
  ✔ npm test trên bản chép: 106 đạt, 0 trượt (11.8 s)

Checkpoint 8: 23/23 tiêu chí đạt`;

const CP_PHA_1 = `== 1. Bộ test: cấu trúc và vệ sinh
  ✔ đủ ba tầng: unit 8 tệp, tích hợp 3 tệp, API 6 tệp (mỗi tầng ≥ 2)
  ✘ không còn .only / .skip / .todo bị quên: apps/api/test/unit/cursor.test.ts
  ✔ mọi tệp test đều có khẳng định (expect)
  ✔ test KHÔNG đọc .env của máy dev (không loadEnvFile/dotenv trong test/)
  ✔ typecheck gồm cả thư mục test (tsconfig.test.json)
== 2. npm test xanh, ổn định, tự dọn
  ✘ lần 1: 96 test đạt, 1 trượt, 12.6 s
  ✘ chạy 3 lần liền: ĐỎ (1) · ĐỎ (1) · ĐỎ (1) — không chập chờn
  ✔ mỗi lần &lt; 60 s (12.6 / 11.0 / 11.6 s)
  ✔ không để lại container fsp-pg-test-* sau khi chạy
== 3. Độ phủ qua ngưỡng đã đặt trong vitest.config.ts
  ✘ npm run test:cov: dòng undefined% — ngưỡng không bị hạ dưới 85%
  ✔ vitest.config.ts có thresholds (lines: 90)
== 4. Phá thử: 8 lỗi thật, mỗi lỗi phải làm test ĐỎ
  ✔ ai cũng xoá được bình luận của người khác (5.1) ⇒ 1 test đỏ
  ✔ refresh song song: bỏ điều kiện revokedAt = null (3.2) ⇒ 4 test đỏ
  ✔ IDOR: sửa bài không kiểm tác giả (4.1) ⇒ 3 test đỏ
  ✔ quên requireAuth ở DELETE /comments/:id (3.3) ⇒ 3 test đỏ
  ✔ lỗi 500 lộ chi tiết cho client (2.3) ⇒ 2 test đỏ
  ✔ cursor dùng &lt;= thay vì &lt; ⇒ trang sau lặp bài (5.2) ⇒ 3 test đỏ
  ✔ bỏ giới hạn điểm ảnh ⇒ bom giải nén lọt (4.3) ⇒ 2 test đỏ
  ✔ mật khẩu không chuẩn hoá NFC ⇒ gõ tiếng Việt máy khác sai (3.1) ⇒ 2 test đỏ
  ✔ bắt 8/8 lỗi; mã nguồn đã trả về nguyên trạng (git diff src/ rỗng)
== 5. Máy sạch: bản chép không node_modules, không .env ⇒ npm ci ⇒ npm test
  ✔ bản chép không có apps/api/.env
  ✔ npm ci trên bản chép (xong)
  ✘ npm test trên bản chép: 95 đạt, 2 trượt (11.0 s)

Checkpoint 8: 18/23 tiêu chí đạt — 5 trượt`;

const LAM_YEU = `diff --git a/apps/api/test/api/binh-luan-thich.api.test.ts b/apps/api/test/api/binh-luan-thich.api.test.ts
index 8a76d53..6c567ed 100644
--- a/apps/api/test/api/binh-luan-thich.api.test.ts
+++ b/apps/api/test/api/binh-luan-thich.api.test.ts
@@ -46,7 +46,6 @@ describe('bình luận qua HTTP', () =&gt; {
       .set(bearer(an.token))
       .send({ body: 'x' })
       .expect(201);
-    await request(app).delete(\`/api/comments/\${bl.body.id}\`).set(bearer(chi.token)).expect(403);
     await request(app).delete(\`/api/comments/\${bl.body.id}\`).set(bearer(an.token)).expect(204);
     await request(app).delete(\`/api/comments/\${bl.body.id}\`).set(bearer(an.token)).expect(404);
   });
diff --git a/apps/api/test/tich-hop/binh-luan.test.ts b/apps/api/test/tich-hop/binh-luan.test.ts
index 2f21bf1..f0a06f5 100644
--- a/apps/api/test/tich-hop/binh-luan.test.ts
+++ b/apps/api/test/tich-hop/binh-luan.test.ts
@@ -26,8 +26,7 @@ describe('xoaBinhLuan — quyền nằm trong câu DELETE, chỉ CSDL thật ki
     const [an, binh, chi] = [await taoNguoi('An'), await taoNguoi('Bình'), await taoNguoi('Chi')];
     const bai = await taoBai(an.id);
     const bl = await taoBinhLuan(bai.id, binh.id, { body: 'Hay' });
-    await expect(xoaBinhLuan(bl.id, chi.id)).rejects.toMatchObject({ status: 403 });
-    expect(await prisma.comment.findUnique({ where: { id: bl.id } })).not.toBeNull();
+    expect(bl.id).toBeDefined();
   });
 });
 `;

const CP_PHA_2 = `== 1. Bộ test: cấu trúc và vệ sinh
  ✔ đủ ba tầng: unit 8 tệp, tích hợp 3 tệp, API 6 tệp (mỗi tầng ≥ 2)
  ✔ không còn .only / .skip / .todo bị quên
  ✔ mọi tệp test đều có khẳng định (expect)
  ✔ test KHÔNG đọc .env của máy dev (không loadEnvFile/dotenv trong test/)
  ✔ typecheck gồm cả thư mục test (tsconfig.test.json)
== 2. npm test xanh, ổn định, tự dọn
  ✔ lần 1: 106 test đạt, 0 trượt, 9.9 s
  ✔ chạy 3 lần liền: xanh · xanh · xanh — không chập chờn
  ✔ mỗi lần &lt; 60 s (9.9 / 10.7 / 11.0 s)
  ✔ không để lại container fsp-pg-test-* sau khi chạy
== 3. Độ phủ qua ngưỡng đã đặt trong vitest.config.ts
  ✔ npm run test:cov: dòng 92.25% — ngưỡng không bị hạ dưới 85%
  ✔ vitest.config.ts có thresholds (lines: 90)
== 4. Phá thử: 8 lỗi thật, mỗi lỗi phải làm test ĐỎ
  ✘ ai cũng xoá được bình luận của người khác (5.1) ⇒ test VẪN XANH — lỗi lọt!
  ✔ refresh song song: bỏ điều kiện revokedAt = null (3.2) ⇒ 3 test đỏ
  ✔ IDOR: sửa bài không kiểm tác giả (4.1) ⇒ 2 test đỏ
  ✔ quên requireAuth ở DELETE /comments/:id (3.3) ⇒ 2 test đỏ
  ✔ lỗi 500 lộ chi tiết cho client (2.3) ⇒ 1 test đỏ
  ✔ cursor dùng &lt;= thay vì &lt; ⇒ trang sau lặp bài (5.2) ⇒ 4 test đỏ
  ✔ bỏ giới hạn điểm ảnh ⇒ bom giải nén lọt (4.3) ⇒ 1 test đỏ
  ✔ mật khẩu không chuẩn hoá NFC ⇒ gõ tiếng Việt máy khác sai (3.1) ⇒ 1 test đỏ
  ✔ bắt 7/8 lỗi; mã nguồn đã trả về nguyên trạng (git diff src/ rỗng)
== 5. Máy sạch: bản chép không node_modules, không .env ⇒ npm ci ⇒ npm test
  ✔ bản chép không có apps/api/.env
  ✔ npm ci trên bản chép (xong)
  ✔ npm test trên bản chép: 106 đạt, 0 trượt (11.9 s)

Checkpoint 8: 22/23 tiêu chí đạt — 1 trượt`;

const CP_DAY_DU = `== 0. Checkpoint 7 vẫn đạt
  ✔ checkpoint-7: KẾT QUẢ: 16 đạt, 0 trượt
== 1. Bộ test: cấu trúc và vệ sinh
  ✔ đủ ba tầng: unit 8 tệp, tích hợp 3 tệp, API 6 tệp (mỗi tầng ≥ 2)
  ✔ không còn .only / .skip / .todo bị quên
  ✔ mọi tệp test đều có khẳng định (expect)
  ✔ test KHÔNG đọc .env của máy dev (không loadEnvFile/dotenv trong test/)
  ✔ typecheck gồm cả thư mục test (tsconfig.test.json)
== 2. npm test xanh, ổn định, tự dọn
  ✔ lần 1: 106 test đạt, 0 trượt, 9.1 s
  ✔ chạy 3 lần liền: xanh · xanh · xanh — không chập chờn
  ✔ mỗi lần &lt; 60 s (9.1 / 8.4 / 8.8 s)
  ✔ không để lại container fsp-pg-test-* sau khi chạy
== 3. Độ phủ qua ngưỡng đã đặt trong vitest.config.ts
  ✔ npm run test:cov: dòng 92.25% — ngưỡng không bị hạ dưới 85%
  ✔ vitest.config.ts có thresholds (lines: 90)
== 4. Phá thử: 8 lỗi thật, mỗi lỗi phải làm test ĐỎ
  ✔ ai cũng xoá được bình luận của người khác (5.1) ⇒ 2 test đỏ
  ✔ refresh song song: bỏ điều kiện revokedAt = null (3.2) ⇒ 3 test đỏ
  ✔ IDOR: sửa bài không kiểm tác giả (4.1) ⇒ 2 test đỏ
  ✔ quên requireAuth ở DELETE /comments/:id (3.3) ⇒ 2 test đỏ
  ✔ lỗi 500 lộ chi tiết cho client (2.3) ⇒ 1 test đỏ
  ✔ cursor dùng &lt;= thay vì &lt; ⇒ trang sau lặp bài (5.2) ⇒ 4 test đỏ
  ✔ bỏ giới hạn điểm ảnh ⇒ bom giải nén lọt (4.3) ⇒ 1 test đỏ
  ✔ mật khẩu không chuẩn hoá NFC ⇒ gõ tiếng Việt máy khác sai (3.1) ⇒ 1 test đỏ
  ✔ bắt 8/8 lỗi; mã nguồn đã trả về nguyên trạng (git diff src/ rỗng)
== 5. Máy sạch: bản chép không node_modules, không .env ⇒ npm ci ⇒ npm test
  ✔ bản chép không có apps/api/.env
  ✔ npm ci trên bản chép (xong)
  ✔ npm test trên bản chép: 106 đạt, 0 trượt (10.0 s)

Checkpoint 8: 24/24 tiêu chí đạt`;


const MERMAID = `flowchart LR
  A["npm test xanh?"] -->|"không"| X["sửa test/mã trước"]
  A -->|"có"| B["xanh 3 lần liền?<br/>(không chập chờn)"]
  B --> C["độ phủ ≥ sàn?<br/>(không tụt)"]
  C --> D["cài 8 lỗi thật<br/>mỗi lỗi ⇒ đỏ?"]
  D --> E["bản chép sạch:<br/>npm ci ⇒ npm test"]
  E --> F["✔ bộ test đáng tin"]`;

const MERMAID_EN = `flowchart LR
  A["npm test green?"] -->|"no"| X["fix tests/code first"]
  A -->|"yes"| B["green 3 times in a row?<br/>(not flaky)"]
  B --> C["coverage ≥ floor?<br/>(no regression)"]
  C --> D["plant 8 real bugs<br/>each ⇒ red?"]
  D --> E["clean copy:<br/>npm ci ⇒ npm test"]
  E --> F["✔ a suite you can trust"]`;

const THE = [
  lienKet({ khoa: 'testing', bai: 'tst-8-1-do-phu', title: 'Testing 8.1 — Độ phủ: đo được gì và không đo được gì', sub: 'Dòng, nhánh, hàm — và vì sao 100% vẫn có thể chẳng kiểm gì.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-8-2-mutation', title: 'Testing 8.2 — Mutation testing: kiểm tra chính bộ test', sub: 'Stryker làm tự động thứ checkpoint-8 làm bằng tay với 8 lỗi.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-8-3-flaky', title: 'Testing 8.3 — Test chập chờn: tìm và sửa', sub: 'Chạy lặp, cô lập, thời điểm — như vụ CSDL dùng chung ở 8.2.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-9-3-bat-buoc', title: 'Testing 9.3 — Check bắt buộc và bảo vệ nhánh', sub: 'Chương 10 sẽ biến npm test thành check bắt buộc trên GitHub.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-14-5-do-phu-flaky-ci', title: 'Node.js 14.5 — Độ phủ, test chập chờn và CI', sub: 'Cùng chủ đề, góc nhìn Node thuần.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '8.4 — Checkpoint 8: npm test is green with meaningful coverage|||8.4 — Checkpoint 8: npm test chạy xanh với độ phủ có ý nghĩa',
  slug: 'fp-8-4-checkpoint-8',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Độ phủ 92,25% dòng — nghĩa là gì và không nghĩa là gì: một tệp test không có expect nào đạt 100% trên cursor.ts trong khi bug thật sống sót. Checkpoint 8 tự chấm bộ test bằng 23 tiêu chí: ba tầng, không .only/.skip, không đọc .env, xanh 3 lần liền dưới 60 s, không để lại container, độ phủ qua sàn, CÀI 8 LỖI THẬT từ các chương trước và đòi mỗi lỗi làm test đỏ, rồi chạy lại trên bản chép sạch. Phá thử chính checkpoint: một it.only bị quên làm bản đầu báo "bắt được" giả; xoá hai khẳng định 403 ⇒ độ phủ không đổi, lỗi lọt.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Checkpoint</span>
<h2>"Meaningful coverage" is not a percentage</h2>
<p class="lead">The chapter's goal says "npm test is green with meaningful coverage". Green is easy — delete the tests. Coverage is easy too, as you'll see: a test with no assertions reaches 100%. What we want is a suite that goes red when someone breaks a rule ChiaSe depends on. This checkpoint measures exactly that, by breaking the rules on purpose.</p>

<pre><code class="language-mermaid">${MERMAID_EN}</code></pre>

<h3>1. The commands</h3>
<pre><code class="language-json">${SCRIPTS}</code></pre>
<p><code>npm test</code> at the repo root runs both projects; <code>test:unit</code> and <code>test:watch</code> are the fast loop while you code (1.3 s, no Docker). <code>test:cov</code> adds coverage with the V8 engine's built-in counters.</p>

<h3>2. Coverage: what the numbers said</h3>
<p>After lessons 8.1–8.2 (unit + integration only):</p>
<div class="out">${PHU_DAU}</div>
<p>The table was a to-do list: <code>image.service.ts</code> at 12.5% (the image approval — the riskiest code in the project), every controller near 0% (no HTTP tests yet). The S3 fake and the API tests of 8.3 brought it to:</p>
<div class="out">${PHU}</div>
<p>Read the remaining gaps instead of chasing them: <code>post.service.ts</code> lines 118–131 are editing a post's image (same <code>duyetAnh</code> already tested, new path through it — worth a test, written down as the next one); <code>realtime/index.ts</code> 47–52 is the Redis adapter (needs Redis); <code>prisma.ts</code> 27–29 is the SQL counter used only with <code>DEM_SQL=1</code>. The thresholds in <code>vitest.config.ts</code> sit just under today's numbers: a floor so coverage can't silently drop, not a target to game.</p>

<h3>3. Coverage measures execution, not checking</h3>
<pre><code class="language-ts">${GIA_VO}</code></pre>
<div class="out">${GIA_VO_BANG}</div>
<p>100% lines, branches and functions. Now break the cursor the way lesson 5.2 warned about (<code>&lt;</code> becomes <code>&lt;=</code>, the next page repeats the last item):</p>
<div class="out">${GIA_VO_PHU}</div>
<p>The pretend test stays green; the real <code>cursor.test.ts</code> goes red twice. That is the idea behind <em>mutation testing</em>: change the code in small, realistic ways and count how many changes your tests notice. Tools like Stryker do it automatically across thousands of mutants (see the Testing course); the checkpoint below does it by hand with eight bugs we have actually discussed — slower to grow, but every one maps to a lesson.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — "raising coverage" with assertion-free tests.</strong> Asked for more coverage before a deadline, the fastest move is a test that calls functions and expects nothing — exactly section 3. The number goes up, the suite gets no stronger, and the next person trusts it. Checkpoint 8 requires assertions in every test file and requires planted bugs to be caught, precisely to block this.</p></div>

<h3>4. The script</h3>
<pre><code class="language-js">${SCRIPT}</code></pre>
<p>Design notes: mutations are plain string replacements of code that must exist (if the code changed, the checkpoint says so instead of silently skipping); originals are restored in <code>finally</code> and on Ctrl+C, and the script checks <code>git diff</code> afterwards; step 5 copies the repo without <code>node_modules</code> and without <code>.env</code> to prove the tests need nothing but Docker.</p>

<h3>5. Runs</h3>
<p>First run (without the Checkpoint 7 chain):</p>
<div class="out">${CP_1}</div>
<p>23/23 on the first try is suspicious — a checker you have never seen fail is a checker you haven't tested. Break the suite, not the code. First: leave an <code>it.only</code> in <code>cursor.test.ts</code> and weaken the two tests that guard comment deletion:</p>
<div class="out">${CP_PHA_1}</div>
<p>The <code>.only</code> is caught, and the suite is red (Vitest refuses <code>.only</code> when <code>CI</code> is set). But look at step 4: every planted bug "caught", including the comment-permission bug whose guards we had just deleted. Of course — when the suite is already red, any change leaves it red. A check that is always red proves as little as one that is always green. The script now refuses to run mutations unless run 1 was green. Second experiment, the weakened tests alone:</p>
<pre><code class="language-diff">${LAM_YEU}</code></pre>
<div class="out">${CP_PHA_2}</div>
<p>Coverage: 92.25%, unchanged to the hundredth — the same lines still execute. The mutation step names the hole: "test VẪN XANH — lỗi lọt!". That one line is why this checkpoint exists.</p>
<p>Finally the full chain, with Checkpoint 7 (which runs 6 → … → 1, real Chrome) against the development stack:</p>
<div class="out">${CP_DAY_DU}</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">xanh</span><span class="lz-d">npm test xanh, ≥ 100 test, ba tầng</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">ổn định</span><span class="lz-d">3 lần liền, &lt; 60 s, không để lại container</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">sàn</span><span class="lz-d">độ phủ không tụt dưới ngưỡng</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">bắt lỗi</span><span class="lz-d">8 lỗi thật, mỗi lỗi ⇒ đỏ (chỉ khi gốc xanh)</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">máy sạch</span><span class="lz-d">không node_modules, không .env ⇒ vẫn xanh</span></div>
</div>

<h3>Everyday analogy</h3>
<p>A fire drill where the alarm never rings tells you nothing about the alarm. Fire departments test detectors with smoke. Checkpoint 8 is the smoke: eight known fires, and the alarm has to ring for each.</p>

<h3>On the job</h3>
<p>Many outsourcing customers (and FPT Software projects) run SonarQube with a quality gate on coverage of new code — commonly 80%. You will meet developers who hit 80% with tests like section 3's. Be the one who can say: "coverage is 92%, and here is the list of bugs the suite is proven to catch." When a reviewer asks for more coverage on a file, ask which bug the new test would catch; if nobody can name one, write that test later.</p>

${spring(true, 'In a Spring project, JaCoCo produces the coverage report (<code>jacoco-maven-plugin</code>, a <code>check</code> goal with minimum ratios is the floor), and PIT (pitest) is the mutation-testing tool. Lab 11.6 of the Spring course asks for the same deliverable: a green suite plus a reason to trust it.', [
  ['sb-11-6-lab-11', 'Spring Boot 11.6 — Chapter 11 lab + interview questions'],
  ['sb-11-7-quiz', 'Spring Boot 11.7 — Chapter 11 quiz'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"What coverage do you aim for?"</strong> — A floor that prevents regression, set from what is measured; the target is that important rules are tested, proven by mutations, not a number.</li>
<li><strong>"Line vs branch coverage?"</strong> — Lines executed vs both sides of each decision taken; branch coverage finds the untested <code>else</code>.</li>
<li><strong>"What is mutation testing?"</strong> — Introduce small faults into the code and check that tests fail; surviving mutants show weak tests.</li>
<li><strong>"How do you deal with a flaky test?"</strong> — Reproduce by repeating, find the shared state or timing, fix isolation; never just add retries.</li>
<li><strong>"How do you prove your tests don't depend on your machine?"</strong> — Run them from a clean copy (or CI) with no local config; containers for dependencies.</li>
</ol>

<h3>🧪 Checkpoint 8</h3>
<div class="callout ok">
<pre><code class="language-bash">npm test                                # cả hai tầng, ~10 s, chỉ cần Docker
npm run test:cov -w apps/api            # bảng độ phủ + ngưỡng
node scripts/checkpoint-8.mjs --bo-cp7  # ~3 phút: 23 tiêu chí, 8 lỗi cài thử, bản chép sạch
node scripts/checkpoint-8.mjs           # + Checkpoint 7 → 1 (cần Postgres + MinIO dev, Chrome)</code></pre>
<p><strong>Done when:</strong> 23/23 (24/24 with the chain); you have broken the checkpoint itself at least twice (a forgotten <code>.only</code>, a deleted assertion) and seen it complain; and you can name, for each planted bug, the test that catches it.</p>
<p><strong>Rubric (10):</strong> one-command suite on a clean copy (2) · three layers with the right things mocked (2) · stable 3/3, no leftovers (1) · coverage floor with the gaps explained (1) · 8/8 planted bugs caught (3) · checkpoint broken on purpose and fixed (1).</p>
</div>
<details><summary>Solution</summary>
<p>Branch <code>ch8/test</code>: <code>scripts/checkpoint-8.mjs</code>, <code>apps/api/vitest.config.ts</code> (coverage + thresholds + <code>silent</code>), scripts in <code>apps/api/package.json</code> and the root <code>package.json</code>, README section 5g.</p>
</details>

<h3>📌 Summary</h3>
<ul>
<li>Coverage says which lines ran; a suite with no assertions can reach 100%.</li>
<li>Use coverage as a floor and as a map of untested code; explain the gaps you keep.</li>
<li>Measure the suite by planting real bugs — and only from a green baseline.</li>
<li>Deleting two assertions left coverage at 92.25% and let a permission bug through; only the mutation step noticed.</li>
<li>A clean copy without <code>node_modules</code> or <code>.env</code> must still be green: Chapter 10 will run exactly this in CI.</li>
</ul>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Checkpoint</span>
<h2>"Độ phủ có ý nghĩa" không phải một con số phần trăm</h2>
<p class="lead">Mục tiêu chương ghi "npm test chạy xanh với độ phủ có ý nghĩa". Xanh thì dễ — xoá test đi. Độ phủ cũng dễ, bạn sẽ thấy: một test không khẳng định gì vẫn đạt 100%. Thứ ta muốn là một bộ test ĐỎ khi có người làm hỏng một luật ChiaSe dựa vào. Checkpoint này đo đúng điều đó, bằng cách cố ý làm hỏng các luật.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Các lệnh</h3>
<pre><code class="language-json">${SCRIPTS}</code></pre>
<p><code>npm test</code> ở gốc repo chạy cả hai project; <code>test:unit</code> và <code>test:watch</code> là vòng lặp nhanh khi đang viết mã (1,3 s, không cần Docker). <code>test:cov</code> thêm độ phủ bằng bộ đếm có sẵn của engine V8.</p>

<h3>2. Độ phủ: các con số nói gì</h3>
<p>Sau bài 8.1–8.2 (mới có unit + tích hợp):</p>
<div class="out">${PHU_DAU}</div>
<p>Bảng này là danh sách việc cần làm: <code>image.service.ts</code> 12,5% (duyệt ảnh — đoạn mã rủi ro nhất dự án), mọi controller gần 0% (chưa có test HTTP). Kho S3 giả và test API của bài 8.3 đưa nó lên:</p>
<div class="out">${PHU}</div>
<p>Đọc các chỗ còn hở thay vì đuổi theo chúng: <code>post.service.ts</code> dòng 118–131 là sửa ảnh của bài (cùng <code>duyetAnh</code> đã test, một đường mới đi qua nó — đáng có test, đã ghi lại làm test kế tiếp); <code>realtime/index.ts</code> 47–52 là Redis adapter (cần Redis); <code>prisma.ts</code> 27–29 là bộ đếm SQL chỉ dùng khi <code>DEM_SQL=1</code>. Ngưỡng trong <code>vitest.config.ts</code> đặt ngay dưới số đo hôm nay: một cái SÀN để độ phủ không lặng lẽ tụt, không phải mục tiêu để "làm đẹp số".</p>

<h3>3. Độ phủ đo việc CHẠY, không đo việc KIỂM</h3>
<pre><code class="language-ts">${GIA_VO}</code></pre>
<div class="out">${GIA_VO_BANG}</div>
<p>100% dòng, nhánh và hàm. Giờ làm hỏng cursor đúng kiểu bài 5.2 đã cảnh báo (<code>&lt;</code> thành <code>&lt;=</code>, trang sau lặp lại phần tử cuối):</p>
<div class="out">${GIA_VO_PHU}</div>
<p>Test giả vờ vẫn xanh; <code>cursor.test.ts</code> thật đỏ hai chỗ. Đó là ý tưởng của <em>mutation testing</em> (kiểm thử đột biến): sửa mã theo những cách nhỏ, giống lỗi thật, rồi đếm xem test nhận ra bao nhiêu. Công cụ như Stryker làm tự động trên hàng nghìn đột biến (xem khoá Testing); checkpoint dưới đây làm bằng tay với tám lỗi ta đã thật sự bàn tới — chậm mở rộng hơn, nhưng lỗi nào cũng gắn với một bài học.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "nâng độ phủ" bằng test không khẳng định.</strong> Bị yêu cầu tăng độ phủ trước hạn nộp, cách nhanh nhất là viết test gọi hàm mà không <code>expect</code> gì — đúng như mục 3. Số đẹp lên, bộ test không mạnh thêm chút nào, và người sau tin nhầm vào nó. Checkpoint 8 đòi mọi tệp test có khẳng định và đòi bắt được lỗi cài thử, chính để chặn kiểu này.</p></div>

<h3>4. Script</h3>
<pre><code class="language-js">${SCRIPT}</code></pre>
<p>Ghi chú thiết kế: đột biến là phép thay chuỗi trên đoạn mã BẮT BUỘC phải có (mã đổi thì checkpoint nói ra, không lặng lẽ bỏ qua); bản gốc được trả lại trong <code>finally</code> và cả khi bấm Ctrl+C, và script kiểm <code>git diff</code> sau đó; bước 5 chép repo không kèm <code>node_modules</code>, không kèm <code>.env</code> để chứng minh test chỉ cần Docker.</p>

<h3>5. Các lần chạy</h3>
<p>Lần đầu (chưa gọi chuỗi Checkpoint 7):</p>
<div class="out">${CP_1}</div>
<p>23/23 ngay lần đầu là đáng ngờ — một bộ chấm bạn chưa từng thấy trượt là một bộ chấm chưa được thử. Phá bộ test, không phá mã. Thử thứ nhất: để quên một <code>it.only</code> trong <code>cursor.test.ts</code> và làm yếu hai test canh việc xoá bình luận:</p>
<div class="out">${CP_PHA_1}</div>
<p><code>.only</code> bị bắt, và bộ test đỏ (Vitest từ chối <code>.only</code> khi có biến <code>CI</code>). Nhưng nhìn bước 4: mọi lỗi cài thử đều "bị bắt", kể cả lỗi phân quyền xoá bình luận mà ta vừa xoá hết người canh. Đương nhiên — bộ test đã đỏ sẵn thì sửa gì nó cũng vẫn đỏ. Phép kiểm lúc nào cũng đỏ chứng minh được ít y như phép kiểm lúc nào cũng xanh. Script giờ từ chối phá thử nếu lần chạy 1 không xanh. Thử thứ hai, chỉ làm yếu test:</p>
<pre><code class="language-diff">${LAM_YEU}</code></pre>
<div class="out">${CP_PHA_2}</div>
<p>Độ phủ: 92,25%, không đổi tới hai chữ số thập phân — các dòng đó vẫn được chạy. Bước phá thử gọi đúng tên lỗ hổng: "test VẪN XANH — lỗi lọt!". Một dòng đó là lý do checkpoint này tồn tại.</p>
<p>Cuối cùng là cả chuỗi, gọi Checkpoint 7 (nó gọi 6 → … → 1, Chrome thật) trên hạ tầng dev:</p>
<div class="out">${CP_DAY_DU}</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">xanh</span><span class="lz-d">npm test xanh, ≥ 100 test, ba tầng</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">ổn định</span><span class="lz-d">3 lần liền, &lt; 60 s, không để lại container</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">sàn</span><span class="lz-d">độ phủ không tụt dưới ngưỡng</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">bắt lỗi</span><span class="lz-d">8 lỗi thật, mỗi lỗi ⇒ đỏ (chỉ khi gốc xanh)</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">máy sạch</span><span class="lz-d">không node_modules, không .env ⇒ vẫn xanh</span></div>
</div>

<h3>Liên hệ đời thường</h3>
<p>Một buổi diễn tập cháy mà chuông không bao giờ reo thì chẳng nói được gì về cái chuông. Lính cứu hoả thử đầu báo khói bằng khói thật. Checkpoint 8 là làn khói: tám đám cháy đã biết, và chuông phải reo cho từng đám.</p>

<h3>Tình huống đi làm thật</h3>
<p>Nhiều khách hàng outsourcing (và dự án ở FPT Software) chạy SonarQube với cổng chất lượng về độ phủ trên mã mới — thường là 80%. Bạn sẽ gặp người đạt 80% bằng những test như ở mục 3. Hãy là người nói được: "độ phủ 92%, và đây là danh sách lỗi mà bộ test đã được chứng minh là bắt được." Khi reviewer đòi thêm độ phủ cho một tệp, hỏi lại: test mới sẽ bắt bug nào? Không ai trả lời được thì để test đó sau.</p>

${spring(false, 'Trong dự án Spring, JaCoCo tạo báo cáo độ phủ (<code>jacoco-maven-plugin</code>, goal <code>check</code> với tỉ lệ tối thiểu chính là cái sàn), còn PIT (pitest) là công cụ kiểm thử đột biến. Lab 11.6 của khoá Spring đòi đúng sản phẩm này: một bộ test xanh cộng một lý do để tin nó.', [
  ['sb-11-6-lab-11', 'Spring Boot 11.6 — Lab chương 11 + câu hỏi phỏng vấn'],
  ['sb-11-7-quiz', 'Spring Boot 11.7 — Kiểm tra chương 11'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Bạn nhắm độ phủ bao nhiêu?"</strong> — Một cái sàn chống tụt, đặt theo số đo thật; mục tiêu là các luật quan trọng được test, chứng minh bằng đột biến, không phải một con số.</li>
<li><strong>"Độ phủ dòng khác độ phủ nhánh thế nào?"</strong> — Dòng đã chạy vs cả hai phía của mỗi rẽ nhánh đã đi qua; độ phủ nhánh tìm ra cái <code>else</code> chưa test.</li>
<li><strong>"Mutation testing là gì?"</strong> — Cài lỗi nhỏ vào mã rồi xem test có đỏ không; đột biến sống sót chỉ ra test yếu.</li>
<li><strong>"Xử lý test chập chờn thế nào?"</strong> — Tái hiện bằng chạy lặp, tìm trạng thái dùng chung hoặc vấn đề thời điểm, sửa cô lập; không bao giờ chỉ thêm retry.</li>
<li><strong>"Làm sao chứng minh test không phụ thuộc máy bạn?"</strong> — Chạy từ bản chép sạch (hoặc CI) không có cấu hình cục bộ; phụ thuộc thì bằng container.</li>
</ol>

<h3>🧪 Checkpoint 8</h3>
<div class="callout ok">
<pre><code class="language-bash">npm test                                # cả hai tầng, ~10 s, chỉ cần Docker
npm run test:cov -w apps/api            # bảng độ phủ + ngưỡng
node scripts/checkpoint-8.mjs --bo-cp7  # ~3 phút: 23 tiêu chí, 8 lỗi cài thử, bản chép sạch
node scripts/checkpoint-8.mjs           # + Checkpoint 7 → 1 (cần Postgres + MinIO dev, Chrome)</code></pre>
<p><strong>Xong khi:</strong> 23/23 (24/24 khi gọi cả chuỗi); bạn đã tự phá chính checkpoint ít nhất hai lần (quên <code>.only</code>, xoá một khẳng định) và thấy nó kêu; và với mỗi lỗi cài thử, bạn chỉ ra được test nào bắt nó.</p>
<p><strong>Thang điểm (10):</strong> một lệnh chạy cả bộ trên bản chép sạch (2) · ba tầng, mock đúng chỗ (2) · ổn định 3/3, không để lại gì (1) · sàn độ phủ + giải thích chỗ hở (1) · bắt 8/8 lỗi cài thử (3) · tự phá checkpoint và sửa (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Nhánh <code>ch8/test</code>: <code>scripts/checkpoint-8.mjs</code>, <code>apps/api/vitest.config.ts</code> (coverage + thresholds + <code>silent</code>), scripts trong <code>apps/api/package.json</code> và <code>package.json</code> gốc, README mục 5g.</p>
</details>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Độ phủ cho biết dòng nào đã chạy; bộ test không khẳng định gì vẫn đạt 100%.</li>
<li>Dùng độ phủ làm sàn và làm bản đồ chỗ chưa test; giải thích những chỗ hở bạn giữ lại.</li>
<li>Đo bộ test bằng cách cài lỗi thật — và chỉ khi gốc đang xanh.</li>
<li>Xoá hai khẳng định: độ phủ vẫn 92,25%, lỗi phân quyền lọt; chỉ bước phá thử nhận ra.</li>
<li>Bản chép sạch không <code>node_modules</code>, không <code>.env</code> vẫn phải xanh: Chương 10 sẽ chạy đúng điều này trên CI.</li>
</ul>
${THE}
</div>
`,
};
