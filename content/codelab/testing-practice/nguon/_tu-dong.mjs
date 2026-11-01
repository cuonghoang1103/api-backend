/**
 * Testing · bộ dựng đề `mutation` TỰ ĐỘNG từ đề của khoá (01/11/2026) — cho 52 đề ngoài 3 đề viết tay (1.1, 1.2, 1.4).
 *
 * `deTuDong(id, { tests, doKho, phut, ... })` đọc đề `id` trong content/courses/testing/_de-codelab-mutation.json và:
 *   - LỜI GIẢI = đúng các tệp test tham khảo của khoá (`tests` — danh sách đã CHỌN: các tệp chạy được trong bộ chạy
 *     trình duyệt, đủ diệt mọi đột biến, xanh với mọi thay đổi vô hại; chọn bằng phép phủ tham lam rồi khai cứng ở
 *     nguon/<bài>.mjs). Đề máy-cục-bộ (`taiMay: true`) lấy MỌI tệp test của `testThamKhao`.
 *   - KHỞI ĐẦU = phần đầu tệp test chính (import + hằng/hook trước describe/it đầu tiên) + MỘT test "khói" chỉ khẳng
 *     định các hàm được import tồn tại ⇒ xanh với code đúng, không diệt đột biến nào (đúng nghĩa "bộ test yếu").
 *   - impl = mọi tệp KHÔNG phải test mà lời giải import (bắc cầu, trừ module bị vi.mock) + `fileDung` + tệp đọc qua
 *     `new URL(…, import.meta.url)` (vd .github/workflows/test.yml, package.json).
 *   - chữ đề EN/VI dựng theo khuôn từ `tieuDe`, `ham`, `yeuCau`, nhãn đột biến (chữ khuôn — gọn hơn 3 đề viết tay).
 *   - đề máy-cục-bộ ⇒ `tests: { loai: 'manual', chayTaiMay }` + tệp `cham-tai-may.mjs` trong code khởi đầu: máy chấm
 *     đột biến chạy trên máy người học (cùng thuật toán scripts/tst/kiem-de-mutation.mjs). Web KHÔNG chấm đề này.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DE_KHOA } from './_chung.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const DU_AN = path.resolve(DAY, '../../../courses/testing/_labflow-lite');
const THU_VIEN = { yaml: fs.readFileSync(path.join(DAY, '_thu-vien/yaml-2.9.1.cjs'), 'utf8') };

const doc = (t) => fs.readFileSync(path.join(DU_AN, t), 'utf8');
const coTep = (t) => fs.existsSync(path.join(DU_AN, t)) && fs.statSync(path.join(DU_AN, t)).isFile();
const laTest = (t) => /\.(test|spec)\.jsx?$/.test(t);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const hai = (s) => { const [en, vi] = String(s).split('|||'); return { en, vi: vi ?? en }; };

function giai(tu, spec) {
  let p = path.posix.normalize(path.posix.join(path.posix.dirname(tu), spec));
  if (!coTep(p) && coTep(p + '.js')) p += '.js';
  return p;
}
const biMock = (t) => [...doc(t).matchAll(/vi\.mock\(\s*['"](\.{1,2}\/[^'"]+)['"]/g)].map((m) => giai(t, m[1]));
/** Tệp `t` + mọi tệp nó import tương đối / đọc qua new URL(…, import.meta.url) — bắc cầu, không đi vào module bị mock. */
function phuThuoc(t, out, bo) {
  if (t in out) return;
  if (bo.includes(t) || !coTep(t)) { out[t] = null; return; }
  out[t] = doc(t);
  if (!/\.(m?js|jsx)$/.test(t)) return;
  for (const m of out[t].matchAll(/(?:from|import)\s*['"](\.{1,2}\/[^'"]+)['"]/g)) phuThuoc(giai(t, m[1]), out, bo);
  for (const m of out[t].matchAll(/new URL\(\s*['"](\.{1,2}\/[^'"]+)['"]\s*,\s*import\.meta\.url\)/g)) phuThuoc(giai(t, m[1]), out, bo);
}
function implCho(d, tests) {
  const out = {};
  for (const t of tests) phuThuoc(t, out, biMock(t));
  for (const f of d.fileDung) if (!(f in out) && coTep(f)) out[f] = doc(f);
  return Object.fromEntries(Object.entries(out).filter(([k, v]) => v != null && !tests.includes(k) && !laTest(k)).sort(([a], [b]) => a.localeCompare(b)));
}
function moRong(p) {
  const a = path.join(DU_AN, p);
  if (!fs.existsSync(a)) throw new Error(`testThamKhao: không có ${p}`);
  if (fs.statSync(a).isDirectory()) return fs.readdirSync(a).sort().flatMap((f) => moRong(path.posix.join(p, f)));
  return [p.replace(/^\.\//, '')];
}

/** Code khởi đầu: phần đầu tệp test chính + một test khói (chỉ khẳng định các tên được import tồn tại). */
function khoiDauTu(tep, laPw) {
  const src = doc(tep);
  const dong = src.split('\n');
  let het = dong.findIndex((l) => /^(describe|it|test|suite)\s*[.(]/.test(l));
  if (het < 0) het = dong.length;
  let dau = dong.slice(0, het).join('\n').replace(/\s+$/, '');
  const ten = [];
  for (const m of dau.matchAll(/^import\s+([^;]+?)\s+from\s*['"](\.{1,2}\/[^'"]+)['"]/gm)) {
    const mau = m[1].trim();
    const md = /^([A-Za-z_$][\w$]*)\s*(,|$)/.exec(mau);
    if (md) ten.push(md[1]);
    const mn = /\{([^}]*)\}/.exec(mau);
    if (mn) for (const x of mn[1].split(',').map((s) => s.trim()).filter(Boolean)) ten.push((/\s+as\s+([\w$]+)$/.exec(x) || [null, x])[1]);
  }
  const loi = laPw
    ? `// Starter: ONE smoke test — it only checks that the app opens. It kills no mutant.
// Write the real tests below (see the task). Khởi đầu: MỘT test khói — chỉ kiểm app mở được, không diệt đột biến nào.
test('starter: the app opens', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
`
    : `// Starter: ONE smoke test — ${ten.length ? 'it only checks that the code under test can be imported' : 'a placeholder'}. It kills no mutant.
// Write the real tests below (see the task). Khởi đầu: MỘT test khói — chỉ kiểm code nạp được, không diệt đột biến nào.
describe('starter', () => {
${ten.length ? `  it('the code under test can be imported', () => {
${ten.map((x) => `    expect(${x}).toBeDefined();`).join('\n')}
  });` : `  it('placeholder — replace me with real tests', () => {
    expect(1 + 1).toBe(2);
  });`}
});
`;
  if (!laPw && !/\bdescribe\b/.test(dau.split('\n').filter((l) => /^import .*from ['"]vitest['"]/.test(l)).join('\n'))) {
    // bảo đảm describe/it/expect có trong import của vitest
    dau = dau.replace(/^import\s*\{([^}]*)\}\s*from\s*(['"])vitest\2;?/m, (m, ds) => {
      const co = ds.split(',').map((s) => s.trim()).filter(Boolean);
      for (const x of ['describe', 'it', 'expect']) if (!co.includes(x)) co.unshift(x);
      return `import { ${co.join(', ')} } from 'vitest';`;
    });
    if (!/from\s*['"]vitest['"]/.test(dau)) dau = `import { describe, it, expect } from 'vitest';\n${dau}`;
  }
  return `${dau}\n\n${loi}`;
}

// ─── máy chấm chạy trên máy người học (đề không chấm được trong trình duyệt) ───
const LY_DO = {
  pg: { en: 'it needs a real PostgreSQL started in Docker by Testcontainers (integration config)', vi: 'nó cần PostgreSQL thật do Testcontainers dựng trong Docker (cấu hình test tích hợp)' },
  pw: { en: 'it drives real browsers with Playwright against the built web app and the e2e server', vi: 'nó điều khiển trình duyệt thật bằng Playwright, chạy trên bản build web + server e2e' },
  web: { en: 'it renders React components with React Testing Library on jsdom (web config)', vi: 'nó dựng component React bằng React Testing Library trên jsdom (cấu hình web)' },
  http: { en: 'it starts the Express API as a Node HTTP server and calls it with Supertest', vi: 'nó dựng API Express thành server HTTP của Node rồi gọi bằng Supertest' },
};
function lyDo(d) {
  if (d.runner === 'playwright') return 'pw';
  if (d.config === 'vitest.integration.config.js') return 'pg';
  if (d.config === 'vitest.web.config.js') return 'web';
  return 'http';
}
function kichBanTaiMay(d, tepHoc) {
  const de = {
    id: d.id, runner: d.runner || 'vitest', config: d.config || null, args: d.args ?? null, tests: tepHoc,
    dotBien: d.dotBien.map(({ file, from, to, label }) => ({ file, from, to, label })),
    voHai: (d.voHai || []).map(({ file, from, to, label }) => ({ file, from, to, label })),
  };
  return `// Code Lab · ${d.id} — LOCAL mutation grader (máy chấm đột biến chạy TRÊN MÁY BẠN).
// Run it inside your labflow-lite project folder:  node cham-tai-may.mjs [test files…]
// (default: the test file(s) of this exercise). ${lyDo(d) === 'pg' ? 'Docker must be running (Testcontainers starts PostgreSQL); do not set TEST_DATABASE_URL — every run needs a fresh database.' : lyDo(d) === 'pw' ? 'Needs the Playwright browsers (npx playwright install) and port 4173 free — Playwright builds the web app and starts the e2e server itself.' : 'Needs the project dependencies (npm ci).'}
// What it does — same algorithm as the course's mutation labs: your tests must be GREEN on the correct code, then each
// planted bug is written into its file one at a time (the file is ALWAYS restored, even on Ctrl+C) and your tests must
// turn RED; harmless changes must keep them GREEN. It prints N/N when every check passes.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const DE = ${JSON.stringify(de, null, 2)};

const tests = process.argv.slice(2).length ? process.argv.slice(2) : DE.tests;
const npx = (args) => spawnSync('npx', args, { encoding: 'utf8', shell: process.platform === 'win32' });
const run = () => (DE.runner === 'playwright'
  ? npx(['playwright', 'test', ...tests, ...(DE.args ?? ['--project=chromium'])])
  : npx(['vitest', 'run', ...(DE.config ? ['--config', DE.config] : []), ...tests, ...(DE.args ?? [])])).status;

let dangSua = null; // { file, goc } — trả lại nếu bị ngắt giữa chừng
const traLai = () => { if (dangSua) { writeFileSync(dangSua.file, dangSua.goc); dangSua = null; } };
process.on('SIGINT', () => { traLai(); process.exit(130); });

function voi(m, fn) {
  const goc = readFileSync(m.file, 'utf8');
  const n = goc.split(m.from).length - 1;
  if (n !== 1) {
    console.log(\`  ? "\${m.label}": the text to change was found \${n} times in \${m.file} — your file differs from the course version; copy \${m.file} from this exercise's starter and run again\`);
    return null;
  }
  dangSua = { file: m.file, goc };
  writeFileSync(m.file, goc.replace(m.from, () => m.to));
  try { return fn(); } finally { traLai(); }
}

console.log(\`\${DE.id}: \${tests.join(' ')} (\${DE.runner})\`);
if (run() !== 0) {
  console.log('✘ Your tests are NOT green on the correct code — fix them first (the code has no bug). 0/' + (DE.dotBien.length + DE.voHai.length));
  process.exit(1);
}
console.log('✔ green on the correct code');
let dat = 0;
for (const m of DE.dotBien) {
  const st = voi(m, run);
  if (st != null && st !== 0) dat++;
  console.log(\`\${st == null ? '?' : st !== 0 ? '✔ killed   ' : '✘ SURVIVED '} \${m.label}\`);
}
for (const m of DE.voHai) {
  const st = voi(m, run);
  if (st === 0) dat++;
  console.log(\`\${st == null ? '?' : st === 0 ? '✔ still green ' : '✘ RED (brittle)'} harmless: \${m.label}\`);
}
const tong = DE.dotBien.length + DE.voHai.length;
console.log(\`\\n\${dat}/\${tong} \${dat === tong ? '— all mutants killed. Mark the exercise solved on the website.' : '— not yet.'}\`);
process.exitCode = dat === tong ? 0 : 1;
`;
}

/** Tham số dòng lệnh của đề ⇒ tuỳ chọn bộ chạy trình duyệt. */
function tuyChonTu(d) {
  const o = {};
  for (const a of d.args || []) {
    if (a === '--sequence.shuffle') o.xaoTron = 20261101;
    const r = /^--repeats=(\d+)$/.exec(a); if (r) o.lapLai = +r[1];
    const t = /^--testTimeout=(\d+)$/.exec(a); if (t) o.tranTestMs = +t[1];
  }
  return o;
}
const ghiChuArgs = (d) => {
  const o = tuyChonTu(d), en = [], vi = [];
  if (o.xaoTron) { en.push('tests run in a <b>shuffled order</b> (<code>--sequence.shuffle</code>, fixed seed) — a test that needs another test to run first goes red'); vi.push('test chạy theo <b>thứ tự xáo trộn</b> (<code>--sequence.shuffle</code>, hạt giống cố định) — test cần test khác chạy trước sẽ đỏ'); }
  if (o.lapLai) { en.push(`every test runs <b>${o.lapLai + 1} times</b> (<code>--repeats=${o.lapLai}</code>) — one red run makes it red, so a flaky test fails`); vi.push(`mỗi test chạy <b>${o.lapLai + 1} lần</b> (<code>--repeats=${o.lapLai}</code>) — một lần đỏ là đỏ, test chập chờn sẽ trượt`); }
  if (o.tranTestMs) { en.push(`each test has <b>${o.tranTestMs} ms</b> (<code>--testTimeout=${o.tranTestMs}</code>) — a test that really sleeps times out`); vi.push(`mỗi test có <b>${o.tranTestMs} ms</b> (<code>--testTimeout=${o.tranTestMs}</code>) — test ngủ thật sẽ quá giờ`); }
  return { en, vi };
};

/**
 * Một đề dựng tự động. Tuỳ chọn: tests (lời giải — danh sách tệp test), tepHoc (tệp người học viết; mặc định tests[0]),
 * taiMay (đề chạy trên máy), doKho, phut, dangBai, timeoutMs, nguong.
 */
export function deTuDong(id, { tests, tepHoc, taiMay = false, doKho = 'MEDIUM', phut = 25, dangBai, timeoutMs = 6000, nguong } = {}) {
  const d = DE_KHOA.find((x) => x.id === id);
  if (!d) throw new Error(`không có đề ${id} trong _de-codelab-mutation.json`);
  const ds = taiMay ? [...new Set(d.testThamKhao.flatMap(moRong))].filter(laTest) : tests;
  if (!ds?.length) throw new Error(`${id}: thiếu danh sách tệp lời giải (tests)`);
  const chinh = tepHoc || ds.find((t) => /\/th\d+[a-z]?\.(test|spec)\./.test(t)) || ds[0];
  const laPw = d.runner === 'playwright';
  const impl = implCho(d, ds);
  const loiGiai = Object.fromEntries(ds.map((t) => [t, doc(t)]));
  const tieuDe = hai(d.tieuDe), yc = hai(d.yeuCau);
  const N = d.dotBien.length, H = (d.voHai || []).length;
  const tepCode = d.fileDung.map((f) => `<code>${esc(f)}</code>`).join(', ');
  const ga = ghiChuArgs(d);
  const lab = /-lab-/.test(d.bai);
  const ly = LY_DO[lyDo(d)];

  const moTaEn = [
    `<p><b>Code under test:</b> ${tepCode} — ${esc(d.ham)}. It is the course's LabFlow Lite code at this point of the course; read it in the file tabs. Editing it changes nothing: the grader always uses the original.</p>`,
    `<p><b>Your task:</b> ${esc(yc.en)}.</p>`,
    taiMay
      ? `<p>⚠️ <b>This exercise is not graded on the website</b> — ${ly.en}, which a browser tab cannot provide. You run the same mutation check on your own machine with <code>cham-tai-may.mjs</code> (it is in the starter): your tests must pass on the correct code, then each of the <b>${N} mutants</b> (copies with one planted bug) must turn at least one test red${H ? `, and the <b>${H} harmless change${H > 1 ? 's' : ''}</b> must keep them green` : ''}. Marking the exercise solved is <b>self-reported</b>.</p>`
      : `<p>The grader runs your tests in the browser against the correct code (all must pass), then against <b>${N} mutants</b> — copies of the code with one planted bug each. A mutant is <b>killed</b> when at least one of your tests fails on it.${H ? ` It also applies <b>${H} harmless change${H > 1 ? 's' : ''}</b> (a refactor that keeps the behaviour): your tests must stay <b>green</b> on ${H > 1 ? 'them' : 'it'}, otherwise they are testing the implementation instead of the behaviour.` : ''}</p>`,
    ga.en.length ? `<p>Like the course command for this lesson: ${ga.en.join('; ')}.</p>` : '',
    `<p>The starter has a single smoke test (${laPw ? 'the app opens' : 'the code under test loads'}) — green, but it kills no mutant.</p>`,
  ].filter(Boolean).join('\n');
  const moTaVi = [
    `<p><b>Code cần test:</b> ${tepCode} — ${esc(d.ham)}. Đây là code LabFlow Lite của khoá ở thời điểm bài này; đọc ở các tab tệp. Sửa nó không có tác dụng: máy chấm luôn dùng bản gốc.</p>`,
    `<p><b>Nhiệm vụ:</b> ${esc(yc.vi)}.</p>`,
    taiMay
      ? `<p>⚠️ <b>Bài này KHÔNG chấm trên website</b> — ${ly.vi}, điều mà một tab trình duyệt không làm được. Bạn chạy cùng phép kiểm đột biến trên máy mình bằng <code>cham-tai-may.mjs</code> (có trong code khởi đầu): test phải xanh với code đúng, rồi mỗi <b>${N} đột biến</b> (bản cài sẵn một lỗi) phải làm ít nhất một test đỏ${H ? `, và <b>${H} thay đổi vô hại</b> phải giữ test xanh` : ''}. Đánh dấu đã giải là <b>tự khai</b>.</p>`
      : `<p>Máy chấm chạy test của bạn ngay trong trình duyệt với code đúng (phải xanh hết), rồi với <b>${N} đột biến</b> — các bản code cài sẵn một lỗi. Đột biến bị <b>diệt</b> khi ít nhất một test của bạn đỏ với nó.${H ? ` Nó còn áp <b>${H} thay đổi vô hại</b> (refactor giữ nguyên hành vi): test phải VẪN XANH, nếu không là bạn đang test cách cài đặt chứ không phải hành vi.` : ''}</p>`,
    ga.vi.length ? `<p>Như lệnh của khoá cho bài này: ${ga.vi.join('; ')}.</p>` : '',
    `<p>Code khởi đầu có đúng một test khói (${laPw ? 'app mở được' : 'code cần test nạp được'}) — xanh nhưng không diệt đột biến nào.</p>`,
  ].filter(Boolean).join('\n');

  const lenh = 'node cham-tai-may.mjs';
  const yeuCauEn = taiMay ? [
    `Download the starter (⬇ Starter) and copy its files into your <code>labflow-lite</code> project — the one you have been building since lesson 0.2. It contains the test file to write (<code>${esc(chinh)}</code>), the course version of the code under test, and <code>cham-tai-may.mjs</code>.`,
    `Write your tests in <code>${esc(chinh)}</code> (more test files are fine: <code>${lenh} &lt;file…&gt;</code>).`,
    `Run <code>${lenh}</code>${lyDo(d) === 'pg' ? ' with Docker running (do not set <code>TEST_DATABASE_URL</code> — every run needs a fresh database)' : lyDo(d) === 'pw' ? ' (Playwright browsers installed: <code>npx playwright install</code>; port 4173 free)' : ''}. It prints <code>${N + H}/${N + H}</code> when every mutant is killed${H ? ' and the harmless changes stay green' : ''}.`,
    'Then press <b>Self-mark as solved</b>. The website cannot verify this — it is your own word.',
  ] : [
    `Write your tests in <code>${esc(chinh)}</code> (Vitest syntax: <code>describe</code> / <code>it</code> / <code>expect</code>; more <code>*.test.js</code> files are fine).`,
    'Every test passes on the correct code and contains at least one <code>expect</code> (a test without an assertion fails — <code>requireAssertions</code>, as in the course config).',
    `Kill <b>all ${N}</b> mutants${H ? ` and stay green on the ${H} harmless change${H > 1 ? 's' : ''}` : ''}.`,
  ];
  const yeuCauVi = taiMay ? [
    `Tải code khởi đầu (⬇ Starter) rồi chép các tệp vào dự án <code>labflow-lite</code> của bạn — dự án bạn dựng từ bài 0.2. Trong đó có tệp test phải viết (<code>${esc(chinh)}</code>), bản code cần test của khoá và <code>cham-tai-may.mjs</code>.`,
    `Viết test vào <code>${esc(chinh)}</code> (nhiều tệp test cũng được: <code>${lenh} &lt;tệp…&gt;</code>).`,
    `Chạy <code>${lenh}</code>${lyDo(d) === 'pg' ? ' khi Docker đang chạy (đừng đặt <code>TEST_DATABASE_URL</code> — mỗi lần chạy cần CSDL mới)' : lyDo(d) === 'pw' ? ' (đã cài trình duyệt Playwright: <code>npx playwright install</code>; cổng 4173 trống)' : ''}. Nó in <code>${N + H}/${N + H}</code> khi mọi đột biến bị diệt${H ? ' và các thay đổi vô hại vẫn xanh' : ''}.`,
    'Rồi bấm <b>Tự đánh dấu đã giải</b>. Website không kiểm được việc này — đó là lời của bạn.',
  ] : [
    `Viết test vào <code>${esc(chinh)}</code> (cú pháp Vitest: <code>describe</code> / <code>it</code> / <code>expect</code>; thêm tệp <code>*.test.js</code> cũng được).`,
    'Mọi test xanh với code đúng và có ít nhất một <code>expect</code> (test không có khẳng định bị tính đỏ — <code>requireAssertions</code>, như cấu hình khoá).',
    `Diệt <b>cả ${N}</b> đột biến${H ? ` và vẫn xanh với ${H} thay đổi vô hại` : ''}.`,
  ];

  const ds1 = d.dotBien.map((m, i) => `M${i + 1} — ${esc(m.label)}`);
  const goiYDb = (m) => `write a test whose result would change if this happened: “${m.label}” — start from the rule, not from the code · viết một test cho kết quả khác đi nếu điều này xảy ra: “${m.label}” — bắt đầu từ luật, không từ code`;
  const de = {
    tieuDe: tieuDe.en === tieuDe.vi ? tieuDe.en : tieuDe,
    ngonNgu: 'javascript',
    doKho, phut,
    ...(dangBai || lab ? { dangBai: dangBai || 'lab' } : {}),
    khaiNiem: ['mutation testing', laPw ? 'Playwright' : 'Vitest', ...(H ? ['harmless refactor (stay green)'] : [])],
    tienQuyet: [d.bai],
    the: ['testing', 'mutation', 'labflow-lite', ...(taiMay ? ['run-locally'] : ['browser-graded'])],
    moTa: { en: moTaEn, vi: moTaVi },
    yeuCau: { en: yeuCauEn, vi: yeuCauVi },
    dauVao: { en: `Your test file(s), starting with ${chinh}.`, vi: `Tệp test của bạn, bắt đầu từ ${chinh}.` },
    dauRa: { en: `Green on the correct code; red on each of the ${N} mutants${H ? `; green on the ${H} harmless change(s)` : ''}.`, vi: `Xanh với code đúng; đỏ với từng đột biến trong ${N}${H ? `; xanh với ${H} thay đổi vô hại` : ''}.` },
    rangBuoc: taiMay
      ? [{ en: `Runs on your machine: ${d.runner === 'playwright' ? `npx playwright test ${(d.args ?? ['--project=chromium']).join(' ')}` : `npx vitest run${d.config ? ` --config ${d.config}` : ''}${(d.args || []).length ? ' ' + d.args.join(' ') : ''}`}.`, vi: `Chạy trên máy bạn: ${d.runner === 'playwright' ? `npx playwright test ${(d.args ?? ['--project=chromium']).join(' ')}` : `npx vitest run${d.config ? ` --config ${d.config}` : ''}${(d.args || []).length ? ' ' + d.args.join(' ') : ''}`}.` }]
      : [{ en: 'Imports: "vitest", relative paths to the exercise files' + (THU_VIEN_CAN(d, ds) ? ', "yaml"' : '') + ', and the browser grader’s "msw" subset / "node:fs" (reads this exercise’s files) where the lesson uses them.', vi: 'Import: "vitest", đường dẫn tương đối tới tệp của đề' + (THU_VIEN_CAN(d, ds) ? ', "yaml"' : '') + ', và bản thu gọn "msw" / "node:fs" (đọc tệp của đề) của máy chấm khi bài dùng tới.' }],
    viDu: [{
      input: { en: `Mutant M1: ${d.dotBien[0].label}`, vi: `Đột biến M1: ${d.dotBien[0].label}` },
      output: { en: 'Killed — at least one of your tests fails on this version.', vi: 'Bị diệt — ít nhất một test của bạn đỏ với bản này.' },
      explanation: { en: 'A test kills a mutant only if it observes the exact decision the mutant changes. A suite that just runs the code (high coverage) can let every mutant survive.', vi: 'Một test chỉ diệt được đột biến khi nó quan sát đúng quyết định mà đột biến làm đổi. Bộ test chỉ chạy qua code (độ phủ cao) vẫn có thể để mọi đột biến sống.' },
    }],
    goiY: [
      { en: taiMay ? 'Run the local grader with the starter first: every mutant survives. Then add one test per rule you see in the task.' : 'Submit the starter first: every mutant survives, and the table names what each one breaks. Then add one test per rule.', vi: taiMay ? 'Chạy máy chấm cục bộ với code khởi đầu trước: mọi đột biến sống. Rồi thêm từng test cho từng luật trong đề.' : 'Nộp code khởi đầu trước: mọi đột biến sống, bảng kết quả nói mỗi cái làm hỏng gì. Rồi thêm từng test cho từng luật.' },
      { en: 'Test the boundaries and both outcomes of every rule; assert exact values (toBe/toEqual/toThrow with the error code), not just “truthy”.', vi: 'Test giá trị biên và cả hai kết quả của mỗi luật; khẳng định giá trị chính xác (toBe/toEqual/toThrow kèm mã lỗi), không chỉ "truthy".' },
      { en: `The lesson ${d.bai} shows the techniques this exercise needs; the reference solution is the course’s own test file(s): ${ds.join(', ')}.`, vi: `Bài ${d.bai} dạy đúng kỹ thuật bài này cần; lời giải tham khảo là chính (các) tệp test của khoá: ${ds.join(', ')}.` },
    ],
    loiHayGap: [
      { en: 'Testing only typical values in the middle of a range — the correct code and an off-by-one mutant agree there, so the mutant survives.', vi: 'Chỉ test giá trị điển hình giữa khoảng — code đúng và đột biến lệch một đơn vị cho cùng kết quả nên đột biến sống.' },
      { en: 'Forgetting await on an async call or on expect(...).rejects — the test finishes before the promise and stays green whatever the code does.', vi: 'Quên await lời gọi async hoặc expect(...).rejects — test kết thúc trước promise và xanh bất kể code làm gì.' },
      ...(H ? [{ en: 'Asserting HOW the code does it (call order, internal fields, exact implementation) — a harmless refactor turns such a test red.', vi: 'Khẳng định CÁCH code làm (thứ tự gọi, trường nội bộ, cài đặt cụ thể) — một refactor vô hại làm test như vậy đỏ.' }] : []),
      ...(taiMay ? [{ en: 'Your project’s copy of the code differs from the course version — the local grader then cannot plant the bug (“found 0 times”). Copy the files from the starter.', vi: 'Bản code trong dự án của bạn khác bản của khoá — máy chấm cục bộ không cài được lỗi ("found 0 times"). Chép các tệp từ code khởi đầu.' }] : []),
    ],
    giaiThich: {
      en: `<p>The reference solution is the course’s own test file(s) for this lesson (${ds.map((t) => `<code>${esc(t)}</code>`).join(', ')}), checked to kill every mutant${H ? ' and to stay green on the harmless change(s)' : ''}. Each mutant changes exactly one decision:</p><ul>${ds1.map((x) => `<li>${x}</li>`).join('')}</ul><p>${taiMay ? 'Verified with the course checker on a fresh copy of LabFlow Lite.' : 'Verified in the browser grader itself.'} A suite kills a mutant only when some test observes that decision — which is why coverage alone does not tell you whether a suite is good.</p>`,
      vi: `<p>Lời giải tham khảo là chính (các) tệp test của khoá cho bài này (${ds.map((t) => `<code>${esc(t)}</code>`).join(', ')}), đã kiểm diệt mọi đột biến${H ? ' và vẫn xanh với thay đổi vô hại' : ''}. Mỗi đột biến đổi đúng một quyết định:</p><ul>${ds1.map((x) => `<li>${x}</li>`).join('')}</ul><p>${taiMay ? 'Đã kiểm bằng máy chấm của khoá trên một bản sao mới của LabFlow Lite.' : 'Đã kiểm bằng chính máy chấm trình duyệt.'} Bộ test chỉ diệt được đột biến khi có test quan sát quyết định đó — vì vậy độ phủ một mình không nói được bộ test tốt hay không.</p>`,
    },
    thuatNgu: [
      { en: 'mutant', vi: 'đột biến', giaiThich: 'bản code bị cài sẵn MỘT lỗi nhỏ; bộ test tốt phải đỏ với nó' },
      { en: 'killed / survived', vi: 'bị diệt / còn sống', giaiThich: 'test đỏ với đột biến = diệt; vẫn xanh = sống (bộ test có lỗ hổng)' },
      ...(H ? [{ en: 'harmless change', vi: 'thay đổi vô hại', giaiThich: 'refactor giữ nguyên hành vi — bộ test tốt phải VẪN XANH' }] : []),
    ],
    khoiDau: {
      [chinh]: khoiDauTu(chinh, laPw),
      ...(taiMay ? { 'cham-tai-may.mjs': kichBanTaiMay(d, [chinh]) } : {}),
      ...impl,
    },
    loiGiai: { ...loiGiai, ...(taiMay ? { 'cham-tai-may.mjs': kichBanTaiMay(d, ds) } : {}), ...impl },
  };
  if (taiMay) {
    de.tests = {
      loai: 'manual',
      // KHÔNG chấm trong trình duyệt — thông tin cho trang + máy chấm cục bộ (cham-tai-may.mjs)
      chayTaiMay: {
        lenh, lyDo: lyDo(d), runner: d.runner || 'vitest', ...(d.config ? { config: d.config } : {}), ...(d.args ? { args: d.args } : {}),
        tep: [chinh], dotBien: d.dotBien.map((m) => m.label), voHai: (d.voHai || []).map((m) => m.label),
      },
    };
    de.loaiKiem = 'manual';
  } else {
    const can = THU_VIEN_CAN(d, ds);
    de.tests = {
      loai: 'mutation', impl, toiThieuTest: 1, ...(nguong ? { nguong } : {}), timeoutMs,
      ...tuyChonTu(d), ...(can ? { thuVien: { yaml: THU_VIEN.yaml } } : {}),
      dotBien: d.dotBien.map((m) => ({ ...m, goiY: goiYDb(m) })),
      ...(H ? { voHai: d.voHai.map(({ file, from, to, label }) => ({ file, from, to, label })) } : {}),
    };
  }
  return de;
}
function THU_VIEN_CAN(d, ds) {
  const files = { ...implCho(d, ds), ...Object.fromEntries(ds.map((t) => [t, doc(t)])) };
  return Object.entries(files).some(([k, v]) => /\.(m?js|jsx)$/.test(k) && /from\s*['"]yaml['"]/.test(v));
}

/** Tên module ("N.M …") từ slug bài + tiêu đề EN của đề đầu. */
export function tenModule(bai, tieuDe) {
  const m = /^tst-(\d+)-(\d+)-/.exec(bai);
  const en = hai(tieuDe).en;
  return `${m[1]}.${m[2]} ${/-lab-/.test(bai) ? en.replace(/^Lab \d+\s*[—-]\s*/, 'Lab — ') : en}`;
}
