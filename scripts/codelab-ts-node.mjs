/**
 * codelab-ts-node.mjs — máy chấm `ts` chạy trong NODE (01/11/2026), cùng mã nguồn với trình duyệt:
 *   TS_KIEU_SRC / TS_CHAY_SRC (frontend/src/components/code-lab/cham/tsRunner.ts) + chamTs (chamTs.ts) với một "máy"
 *   dựa trên `vm` thay cho Worker, và ĐÚNG tệp tự lưu frontend/public/vendor/typescript-6.0.3/ mà trang tải.
 * Dùng bởi scripts/codelab-xuat-de.mjs (lời giải phải đạt mọi kiểm, khởi đầu trượt ≥ 1, mỗi bài sai mẫu trượt ≥ 1) và
 * frontend/src/components/code-lab/cham/ts.test.ts. Bản chấm thật (Worker, quá giờ, CSP): codelab-kiem-cham-trinh-duyet.
 * Cần Node ≥ 22.18 (nạp .ts bằng bỏ kiểu).
 */
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHAM = path.join(GOC, 'frontend/src/components/code-lab/cham');

let san = null;
async function napMay() {
  if (san) return san;
  // chamTs.ts import './tsRunner' không đuôi (kiểu Next) ⇒ Node không nạp thẳng được: gói bằng esbuild (có sẵn ở gốc)
  const esbuild = createRequire(path.join(GOC, 'package.json'))('esbuild');
  const out = await esbuild.build({
    stdin: { contents: "export * from './tsRunner'; export { chamTs } from './chamTs';", resolveDir: CHAM, loader: 'ts' },
    bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent',
  });
  const runner = await import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);
  const { chamTs } = runner;
  const vendor = path.join(GOC, 'frontend/public', runner.TS_VENDOR_DUONG);
  if (!fs.existsSync(path.join(vendor, 'typescript.js'))) throw new Error(`thiếu ${path.relative(GOC, vendor)} — chạy node scripts/codelab-ts-vendor.mjs`);
  const ts = createRequire(import.meta.url)(path.join(vendor, 'typescript.js'));
  const lib = JSON.parse(fs.readFileSync(path.join(vendor, 'lib-ts.json'), 'utf8'));
  const ctx = vm.createContext({ console });
  vm.runInContext(runner.TS_KIEU_SRC, ctx);
  const kieu = ctx.__CL_TS__;
  const t0 = Date.now();
  kieu.khoiTao(ts, lib);
  san = { runner, chamTs, kieu, ts, msMo: Date.now() - t0 };
  return san;
}

let boQuaTuChoi = false;
/** Máy Node: kiểu trong một vm giữ suốt (như worker biên dịch), mỗi lệnh chạy một vm MỚI (như worker nhẹ). */
export async function mayNode() {
  const m = await napMay();
  if (!boQuaTuChoi) { boQuaTuChoi = true; process.on('unhandledRejection', () => {}); }
  return {
    async kieu(req) {
      const sach = JSON.parse(JSON.stringify(req));
      const ketQua = sach.kiem.length ? m.kieu.kiemKieu(sach) : [];
      const js = req.dich ? m.kieu.dich({ tep: { ...sach.hoc, ...sach.coDinh } }).js : undefined;
      return JSON.parse(JSON.stringify({ ketQua, js }));
    },
    async chay(js, lenh, timeoutMs) {
      // API web mà Worker của trình duyệt có sẵn (vm thì không): URL, URLSearchParams, TextEncoder/Decoder, structuredClone…
      const ctx = vm.createContext({ setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask, URL, URLSearchParams, TextEncoder, TextDecoder, structuredClone, atob, btoa });
      vm.runInContext(m.runner.TS_CHAY_SRC, ctx);
      let hen;
      const quaGio = new Promise((ok) => { hen = setTimeout(() => ok({ ma: 1, stdout: '', stderr: '', tests: [], quaGio: true }), timeoutMs); });
      const r = await Promise.race([ctx.__CL_TS_CHAY__.chay({ js, lenh }), quaGio]);
      clearTimeout(hen);
      return JSON.parse(JSON.stringify(r));
    },
  };
}

/** Chấm một bộ tệp như trình duyệt ⇒ [{ i, dat, thay, moTa }]. */
export async function chamTsNode(testsJson, files) {
  const m = await napMay();
  return m.chamTs(testsJson, testsJson.kiem, files, undefined, await mayNode());
}

export async function thongTinTs() {
  const m = await napMay();
  return { phienBan: m.ts.version, msMo: m.msMo };
}

/**
 * Kiểm một đề đã xuất (payload codelab-seed-authored): lời giải đạt MỌI kiểm · khởi đầu trượt ≥ 1 · mỗi bài sai mẫu trượt ≥ 1.
 * saiMau: [{ nhan, tep }] (tep đè lên khởi đầu, như scripts/ts/kiem-de-ts.mjs).
 */
export async function kiemTsNode(ex, saiMau = []) {
  const tj = ex.testsJson;
  const tep = (b) => Object.fromEntries((b || []).map((x) => [x.name, x.code]));
  const loi = [];
  let g, s;
  try {
    g = await chamTsNode(tj, tep(ex.solutionCodeJson));
    s = await chamTsNode(tj, tep(ex.starterCodeJson));
  } catch (e) {
    return { loi: [`không chạy được máy chấm ts trong Node: ${e.message.split('\n')[0]}`], tomTat: '' };
  }
  const truotG = g.filter((r) => !r.dat);
  if (truotG.length) loi.push(`lời giải trượt ${truotG.length}/${g.length}: ${truotG.slice(0, 3).map((r) => `${r.moTa} — ${r.thay}`).join(' · ')}`);
  const truotS = s.filter((r) => !r.dat).length;
  if (!truotS) loi.push('code khởi đầu đạt mọi kiểm — đề không cho điểm khi chưa làm gì phải trượt ≥ 1');
  let batDuoc = 0;
  const batBoi = [];
  const khoiDau = tep(ex.starterCodeJson);
  for (const sm of saiMau) {
    const r = await chamTsNode(tj, { ...khoiDau, ...sm.tep });
    const tr = r.filter((x) => !x.dat);
    if (tr.length) batDuoc++;
    else loi.push(`bài sai mẫu LỌT: ${sm.nhan}`);
    batBoi.push({ nhan: sm.nhan, kiem: tr.map((x) => x.moTa) });
  }
  return { loi, batBoi, tomTat: `lời giải ${g.length - truotG.length}/${g.length} · khởi đầu trượt ${truotS}/${s.length} · sai mẫu bị bắt ${batDuoc}/${saiMau.length}` };
}
