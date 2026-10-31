/**
 * codelab-mutation-node.mjs — phần Node của máy chấm `mutation` (01/11/2026), dùng bởi scripts/codelab-xuat-de.mjs.
 *
 *  - `dungKiemMutation(tests)`: nguồn đề khai `dotBien: [{ file|tep, from|tim, to|thanh, label|ten, goiY?, an? }]`
 *    (đúng dạng content/courses/testing/_de-codelab-mutation.json) ⇒ `kiem` của máy chấm: kiểm #0 'xanh' + mỗi
 *    đột biến một kiểm 'diet' mang `ma` = tệp đã cài lỗi. `from` phải khớp ĐÚNG 1 chỗ trong `impl[file]`.
 *  - `kiemMutationNode(ex)`: chạy LỜI GIẢI và CODE KHỞI ĐẦU qua đúng bộ chạy của trình duyệt (RUNNER_SRC trong
 *    `vm` — không Worker, không trần giờ: chỉ dùng cho đề tác giả tự soạn) ⇒ lời giải phải xanh + diệt HẾT;
 *    khởi đầu phải xanh (test yếu nhưng đúng) và diệt < ngưỡng. Trả { loi: [], tomTat }.
 * Bản chấm thật (Worker, quá giờ, CSP) vẫn là scripts/codelab-kiem-cham-trinh-duyet.mjs.
 */
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function dungKiemMutation(tests) {
  const loi = [];
  if (!Array.isArray(tests.dotBien)) return { tests, loi };
  const impl = tests.impl || {};
  const kiem = [{
    kiem: 'xanh', nhom: 'xanh',
    moTa: `Your tests pass on the correct code (≥ ${tests.toiThieuTest || 1} tests) · Test của bạn xanh với code đúng`,
  }];
  tests.dotBien.forEach((d, i) => {
    const file = d.file ?? d.tep, from = d.from ?? d.tim, to = d.to ?? d.thanh, ten = d.label ?? d.ten;
    const goc = impl[file];
    if (goc == null) { loi.push(`đột biến #${i + 1}: impl không có tệp ${file}`); return; }
    const n = goc.split(from).length - 1;
    if (n !== 1) { loi.push(`đột biến #${i + 1} "${ten}": "${from}" khớp ${n} chỗ trong ${file} (phải đúng 1)`); return; }
    const moi = goc.replace(from, () => to);
    if (moi === goc) { loi.push(`đột biến #${i + 1}: không đổi gì`); return; }
    kiem.push({
      kiem: 'diet', nhom: 'dot-bien',
      moTa: `Mutant M${i + 1}: ${ten}`,
      ...(d.goiY ? { goiY: d.goiY } : {}),
      ...(d.an ? { an: true } : {}),
      ma: { [file]: moi },
    });
  });
  const { dotBien: _bo, ...rest } = tests;
  void _bo;
  const soDb = kiem.length - 1;
  if (rest.nguong != null && !(Number.isInteger(rest.nguong) && rest.nguong >= 1 && rest.nguong <= soDb)) loi.push(`nguong ${rest.nguong} phải là số nguyên 1..${soDb}`);
  return { tests: { ...rest, kiem }, loi };
}

let runnerSrc = null;
async function napRunner() {
  if (runnerSrc) return runnerSrc;
  // Node ≥ 22.18/23.6 tự bỏ kiểu TS; bản cũ hơn ⇒ ném lỗi, bộ xuất báo "bỏ qua kiểm Node"
  const m = await import(pathToFileURL(path.join(GOC, 'frontend/src/components/code-lab/cham/mutationRunner.ts')).href);
  runnerSrc = m.RUNNER_SRC;
  return runnerSrc;
}

let boQuaTuChoi = false;
async function chayLuot(src, files, tepTest) {
  // Promise bị từ chối mà test không bắt (thường gặp khi một đột biến làm hỏng luồng async): trong Worker của
  // trình duyệt nó chỉ là cảnh báo; Node thì mặc định GIẾT tiến trình ⇒ nuốt, như trình duyệt.
  if (!boQuaTuChoi) { boQuaTuChoi = true; process.on('unhandledRejection', () => {}); }
  const ctx = vm.createContext({ setTimeout, clearTimeout, console: { log() {}, info() {}, warn() {}, error() {}, debug() {} } });
  vm.runInContext(src, ctx);
  return JSON.parse(JSON.stringify(await ctx.__ctMutation.chay({ files, tepTest, tranTestMs: 2000 })));
}

/** Chấm một bộ tệp như trình duyệt: { xanh, soTest, loiXanh, diet, tong, song: [nhãn] }. */
export async function chamNode(tests, files) {
  const src = await napRunner();
  const impl = tests.impl || {};
  const rieng = Object.fromEntries(Object.entries(files).filter(([t]) => !(t in impl)));
  const tepTest = (Array.isArray(tests.tepTest) ? tests.tepTest : tests.tepTest ? [tests.tepTest] : Object.keys(rieng).filter((t) => /\.(test|spec)\.m?js$/.test(t))).sort();
  const g = await chayLuot(src, { ...rieng, ...impl }, tepTest);
  const truot = g.tests.filter((t) => !t.dat);
  const xanh = !g.loiNap && !truot.length && g.tests.length >= (tests.toiThieuTest || 1);
  const out = { xanh, soTest: g.tests.length, loiXanh: g.loiNap || truot.map((t) => `${t.ten}: ${t.loi}`).slice(0, 3).join(' · '), diet: 0, tong: 0, song: [] };
  for (const k of tests.kiem.filter((x) => x.kiem === 'diet')) {
    out.tong++;
    if (!xanh) continue;
    const r = await chayLuot(src, { ...rieng, ...impl, ...k.ma }, tepTest);
    if (r.loiNap || r.tests.some((t) => !t.dat)) out.diet++;
    else out.song.push(k.moTa);
  }
  return out;
}

export async function kiemMutationNode(ex) {
  const tj = ex.testsJson;
  const loi = [];
  const tep = (b) => Object.fromEntries((b || []).map((x) => [x.name, x.code]));
  let g, s;
  try {
    g = await chamNode(tj, tep(ex.solutionCodeJson));
    s = await chamNode(tj, tep(ex.starterCodeJson));
  } catch (e) {
    return { loi: [], tomTat: `bỏ qua kiểm Node (${e.message.split('\n')[0]}) — vẫn phải chạy codelab-kiem-cham-trinh-duyet` };
  }
  const nguong = Number.isInteger(tj.nguong) ? tj.nguong : g.tong;
  if (!g.xanh) loi.push(`lời giải KHÔNG xanh với code đúng (${g.soTest} test): ${g.loiXanh}`);
  else if (g.diet !== g.tong) loi.push(`lời giải chỉ diệt ${g.diet}/${g.tong} — còn sống: ${g.song.join(' · ')}`);
  if (!s.xanh) loi.push(`code khởi đầu phải là bộ test YẾU nhưng ĐÚNG (xanh, ≥ ${tj.toiThieuTest || 1} test): ${s.soTest} test · ${s.loiXanh || 'thiếu test'}`);
  else if (s.diet >= nguong) loi.push(`code khởi đầu đã diệt ${s.diet}/${s.tong} ≥ ngưỡng ${nguong} — bộ test khởi đầu quá mạnh`);
  return { loi, tomTat: `lời giải ${g.soTest} test diệt ${g.diet}/${g.tong} · khởi đầu ${s.soTest} test diệt ${s.diet}/${s.tong} (ngưỡng ${nguong})` };
}
