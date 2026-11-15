#!/usr/bin/env node
/**
 * Chấm LỜI GIẢI SAI MẪU (`saiMau` trong nguồn đề) bằng MÁY CHẤM TRÌNH DUYỆT THẬT (Chromium + frontend/src/components/code-lab/cham),
 * dưới CSP của web — bổ sung cho codelab-kiem-cham-trinh-duyet.mjs (chỉ chấm lời giải đúng + code khởi đầu).
 *
 *   npx tsx content/codelab/dsa-interview-practice/nguon/_kiem-sai-mau.mjs [--chi <module-slug>]
 *
 * Mỗi sai mẫu phải TRƯỢT ≥ 1 kiểm; sai mẫu `chiHieuNang` (vd O(n²) đúng kết quả) phải ĐẠT mọi kiểm thường và TRƯỢT mọi
 * kiểm hiệu năng ("quá 4s") — chứng minh kiểm hiệu năng là thứ bắt nó, trên đúng máy chấm người học dùng.
 * Đọc JSON đã xuất (tests đã có mongDoi) + sổ sai mẫu của _dsa.mjs (nạp lại nguồn).
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const NGUON = path.dirname(fileURLToPath(import.meta.url));
const THU_MUC = path.join(NGUON, '..');
const GOC = path.resolve(NGUON, '../../../..');
const require = createRequire(path.join(GOC, 'package.json'));
const { chromium } = require('playwright');
const esbuild = require('esbuild');
const { testsDayDu } = await import(path.join(GOC, 'src/services/codeLab.cham.ts'));
const { SO_SAI_MAU } = await import(pathToFileURL(path.join(NGUON, '_dsa.mjs')).href);

const args = process.argv.slice(2);
const CHI = args.includes('--chi') ? args[args.indexOf('--chi') + 1] : null;

const deTheoTen = new Map();
for (const f of fs.readdirSync(NGUON).filter((x) => x.endsWith('.mjs') && !x.startsWith('_')).sort()) {
  const m = (await import(pathToFileURL(path.join(NGUON, f)).href)).default;
  if (CHI && m.slug !== CHI) continue;
  const json = JSON.parse(fs.readFileSync(path.join(THU_MUC, `dsa-interview-practice__${m.slug}.json`), 'utf8'));
  for (const ex of json.exercises) deTheoTen.set(ex.title, { module: m.slug, ex });
}
const viec = SO_SAI_MAU.filter((s) => deTheoTen.has(s.tieuDe));
if (!viec.length) { console.log('Không có sai mẫu nào.'); process.exit(0); }

const goi = await esbuild.build({
  entryPoints: [path.join(GOC, 'frontend/src/components/code-lab/cham/index.ts')],
  bundle: true, format: 'iife', globalName: 'ClCham', write: false, target: 'es2020', platform: 'browser',
});
const cfg = require(path.join(GOC, 'frontend/next.config.js'));
const headers = await (cfg.headers ? cfg.headers() : cfg.default.headers());
const csp = headers.find((h) => h.source.startsWith('/:path')).headers.find((h) => h.key === 'Content-Security-Policy').value.replace(/;\s*upgrade-insecure-requests/, '');
const trang = `<!doctype html><html><head><meta charset="utf-8"></head><body><script>${goi.outputFiles[0].text.replace(/<\/script/gi, '<\\/script')}</script></body></html>`;
const sv = http.createServer((req, res) => { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'content-security-policy': csp }); res.end(trang); });
await new Promise((r) => sv.listen(0, '127.0.0.1', r));
const trinhDuyet = await chromium.launch({ headless: true });
const page = await trinhDuyet.newPage();
await page.goto(`http://127.0.0.1:${sv.address().port}/`);

let hong = 0; let id = 1; const t0 = Date.now();
for (const s of viec) {
  const { module, ex } = deTheoTen.get(s.tieuDe);
  const tj = testsDayDu(ex.testsJson, id++);
  const r = await page.evaluate(async ({ tj, files }) => {
    const kq = await window.ClCham.chamBai({ exerciseId: 0, tj, files, traLoi: {} });
    return kq.ketQua.map((k) => ({ i: k.i, dat: k.dat, thay: k.thay, ms: k.ms }));
  }, { tj, files: { 'solution.js': s.ma } });
  const truot = r.filter((k) => !k.dat);
  const perf = new Set(s.perfIdx);
  let ok = truot.length > 0;
  if (s.chiHieuNang) ok = ok && r.every((k) => (perf.has(k.i) ? !k.dat : k.dat));
  const moTa = truot.map((k) => `#${k.i + 1}${perf.has(k.i) ? '(hiệu năng)' : ''} ${k.ms ?? '?'}ms ${String(k.thay ?? '').slice(0, 50)}`).join(' · ');
  console.log(`  ${ok ? '✓' : '✗'} [${module}] "${s.tieuDe}" — sai mẫu "${s.ten[0]}": trượt ${truot.length}/${r.length}${s.chiHieuNang ? ' (chỉ được trượt kiểm hiệu năng)' : ''} — ${moTa}`);
  if (!ok) hong++;
}
await trinhDuyet.close();
sv.close();
console.log(hong ? `\n✗ ${hong}/${viec.length} sai mẫu KHÔNG bị bắt đúng cách` : `\n✓ ${viec.length} sai mẫu đều bị máy chấm trình duyệt bắt (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
process.exit(hong ? 1 : 0);
