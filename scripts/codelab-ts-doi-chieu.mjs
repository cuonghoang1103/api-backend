#!/usr/bin/env node
/**
 * codelab-ts-doi-chieu.mjs — ĐỐI CHIẾU máy chấm `ts` của trình duyệt (TypeScript 6.0.3 + shim node:test/assert) với
 * công cụ THẬT của khoá (tsc 7.0.2 + Node 22) — TỪNG KIỂM, trên lời giải, code khởi đầu và mọi bài sai mẫu (01/11/2026).
 *
 *   cp -r content/courses/typescript/_labflow-ts <SCRATCH>/labflow-ts && (cd <SCRATCH>/labflow-ts && npm ci)
 *   node scripts/codelab-ts-doi-chieu.mjs <SCRATCH>/labflow-ts [--chi <id-đề-khoá>…]
 *
 * Kiểm thật dựng y như scripts/ts/kiem-de-ts.mjs (thư mục tạm TRONG dự án, tsconfig extends gốc + include đúng tệp).
 * phai-loi so với mã GỐC của khoá (tsc 7) ⇒ một lệch đã biết: ts-cl-1-2-d kiem/sai.ts:6 (7: TS2739, 6: TS2345 — máy chấm
 * web nhận cả hai, xem content/codelab/typescript-practice/nguon/_chung.mjs › MA_THEM_TS6). Thoát 1 nếu có lệch KHÁC.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chamTsNode } from './codelab-ts-node.mjs';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const duAn = path.resolve(args[0] || '');
const chi = args.includes('--chi') ? args.slice(args.indexOf('--chi') + 1) : [];
const { DE_KHOA, deTs, MA_THEM_TS6 } = await import(path.join(GOC, 'content/codelab/typescript-practice/nguon/_chung.mjs'));
const TSC = path.join(duAn, 'node_modules/.bin/tsc');

function sh(cmd, a, cwd) {
  try { return { code: 0, out: execFileSync(cmd, a, { cwd, encoding: 'utf8', stdio: 'pipe', env: { PATH: path.dirname(process.execPath) + ':/usr/bin:/bin', HOME: cwd, NO_COLOR: '1', TZ: 'UTC' } }) }; }
  catch (e) { return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') }; }
}
const loiCua = (out) => out.split('\n').map((l) => /^(.+?)\((\d+),\d+\): error (TS\d+)/.exec(l)).filter(Boolean).map((m) => ({ f: m[1], d: +m[2], ma: m[3] }));

/** Kết quả THẬT (tsc 7 + node 22) cho từng kiểm của bộ luyện. */
function thatCho(tj, tep) {
  const dir = path.join(duAn, '.doi-chieu');
  rmSync(dir, { recursive: true, force: true });
  const viet = (rel, s) => { mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); writeFileSync(path.join(dir, rel), s); };
  for (const [rel, s] of Object.entries({ ...tep, ...tj.coDinh })) viet(rel, s);
  const hoc = Object.keys(tep).filter((f) => !(f in tj.coDinh));
  const nho = new Map();
  const tsc = (files) => {
    const k = [...files].sort().join('|');
    if (!nho.has(k)) {
      writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({ extends: path.join(duAn, 'tsconfig.json'), compilerOptions: { types: ['node'] }, include: files }));
      const r = sh(TSC, ['-p', 'tsconfig.json'], dir);
      nho.set(k, { code: r.code, loi: loiCua(r.out) });
    }
    return nho.get(k);
  };
  const out = tj.kiem.map((k) => {
    if (k.kiem === 'sach') return tsc([...hoc, ...k.tep]).code === 0;
    if (k.kiem === 'phai-loi') return tsc([...hoc, k.tep]).loi.some((e) => e.f === k.tep && e.d === k.dong && e.ma === k.ma[0]);
    if (k.kiem === 'khong-loi-la') {
      const dong = readFileSync(path.join(dir, k.tep), 'utf8').split('\n');
      return !tsc([...hoc, k.tep]).loi.some((e) => e.f === k.tep && !/\/\/ expect (TS\d+)\s*$/.test(dong[e.d - 1] ?? ''));
    }
    if (k.kiem === 'co-ma') return tsc(hoc).loi.some((e) => e.ma === k.ma);
    if (k.kiem === 'chi-ma') return tsc(hoc).loi.every((e) => k.ma.includes(e.ma));
    if (k.kiem === 'chay') {
      const [cmd, ...a] = k.lenh.split(' ');
      const r = sh(cmd === 'node' ? process.execPath : cmd, a, dir);
      return r.code === 0 && (k.ra == null || r.out.includes(k.ra));
    }
    if (k.kiem === 'cam') return !hoc.some((f) => k.mau.some((m) => new RegExp(m).test(tep[f])));
    throw new Error(`kiểm lạ ${k.kiem}`);
  });
  rmSync(dir, { recursive: true, force: true });
  return out;
}

let tong = 0, khop = 0;
const lech = [];
for (const d of DE_KHOA.filter((x) => !chi.length || chi.includes(x.id))) {
  const de = deTs(d.id);
  const tj = de.tests;
  const bien = [['lời giải', { ...d.loiGiai }], ['khởi đầu', { ...d.khoiDau }], ...d.saiMau.map((s) => [`sai mẫu "${String(s.nhan).split('|||')[0]}"`, { ...d.khoiDau, ...s.tep }])];
  for (const [ten, tep] of bien) {
    const that = thatCho(tj, tep);
    const web = (await chamTsNode(tj, { ...tep, ...tj.coDinh })).map((r) => r.dat);
    tj.kiem.forEach((k, i) => {
      tong++;
      if (that[i] === web[i]) { khop++; return; }
      const daBiet = k.kiem === 'phai-loi' && MA_THEM_TS6[d.id]?.[`${k.tep}:${k.dong}`];
      lech.push({ id: d.id, ten, kiem: k.moTa.split(' · ')[0], that: that[i], web: web[i], daBiet: !!daBiet });
    });
  }
  process.stdout.write('.');
}
console.log(`\n\n${khop}/${tong} kiểm cho cùng kết quả (tsc 7.0.2 + Node 22 thật ↔ máy chấm web TypeScript 6.0.3 + shim)`);
for (const l of lech) console.log(`  ${l.daBiet ? '≈ đã biết' : '✗ LỆCH  '} ${l.id} · ${l.ten} · ${l.kiem} — thật ${l.that ? 'đạt' : 'trượt'}, web ${l.web ? 'đạt' : 'trượt'}`);
process.exitCode = lech.some((l) => !l.daBiet) ? 1 : 0;
