#!/usr/bin/env node
/**
 * _chay.mjs — chạy THẬT mọi đoạn mã của khoá dsa-interview và ghi output cạnh tệp (15/11/2026).
 *
 *   node content/courses/dsa-interview/_chay.mjs                 # chạy hết, ghi <tệp>.out (bỏ qua tệp đo thời gian đã có .out)
 *   node content/courses/dsa-interview/_chay.mjs --chi ch02      # chỉ tệp có 'ch02' trong đường dẫn
 *   node content/courses/dsa-interview/_chay.mjs --do-thoi-gian  # chạy lại cả tệp // @thoi-gian (đo lại, ghi đè số đo)
 *   node content/courses/dsa-interview/_chay.mjs --kiem          # KHÔNG ghi: chạy lại, so với .out đang có, lệch ⇒ exit 1
 *
 * Quy ước trong tệp mã:
 *   // @thoi-gian        tệp đo thời gian: số đo đổi mỗi lần chạy ⇒ --kiem chỉ kiểm chạy được, không so chữ
 *   // @java: TenLop.java  (trong tệp .ts) output của bản TS và bản Java phải GIỐNG nhau (bỏ khoảng trắng + dấu ")
 *   // #region ten / // #endregion   vùng để bài trích một phần (_chung.mjs › ma(rel, { vung }))
 * Tệp *.sim.js chạy trong ĐÚNG worker của trang /algorithms (trích WORKER_SRC từ engine.ts) ⇒ phải ok, ≥ 4 bước.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const MA = path.join(DIR, 'ma');
const REPO = path.resolve(DIR, '../../..');
const TSX = path.join(REPO, 'node_modules/.bin/tsx');
const args = process.argv.slice(2);
const KIEM = args.includes('--kiem');
const DO_TG = args.includes('--do-thoi-gian');
const chi = args.includes('--chi') ? args[args.indexOf('--chi') + 1] : null;
const TAM = path.join(process.env.TMPDIR || os.tmpdir(), 'dsa-nhap', 'java-build');

function liet(d) {
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    return e.isDirectory() ? liet(p) : [p];
  });
}
const tatCa = liet(MA).filter((p) => !chi || p.includes(chi)).sort();
const chuan = (s) => s.replace(/\r/g, '').replace(/[ \t]+$/gm, '').replace(/\n+$/, '');
const rutGon = (s) => s.replace(/[\s"]/g, '');

let loi = 0, chay = 0, lech = 0;
const outCua = new Map();

function ghiHoacSo(p, out, laThoiGian) {
  const f = `${p}.out`;
  outCua.set(p, out);
  if (KIEM) {
    if (!fs.existsSync(f)) { console.log(`❌ thiếu ${path.relative(DIR, f)}`); lech++; return; }
    if (!laThoiGian && chuan(fs.readFileSync(f, 'utf8')) !== chuan(out)) {
      console.log(`❌ output lệch: ${path.relative(DIR, p)} — chạy lại _chay.mjs (không --kiem) rồi xem git diff`);
      lech++;
    }
    return;
  }
  fs.writeFileSync(f, chuan(out) + '\n');
}

for (const p of tatCa) {
  const rel = path.relative(DIR, p);
  if (p.endsWith('.out')) continue;
  const src = /\.(ts|java|js|mjs)$/.test(p) ? fs.readFileSync(p, 'utf8') : '';
  const laThoiGian = /\/\/\s*@thoi-gian\b/.test(src);
  if (/\/\/\s*@bo-qua\b/.test(src)) continue;
  const daCo = fs.existsSync(`${p}.out`);
  const boQuaDo = laThoiGian && daCo && !DO_TG;

  if (p.endsWith('.ts') && !p.endsWith('.d.ts')) {
    if (boQuaDo && !KIEM) { outCua.set(p, fs.readFileSync(`${p}.out`, 'utf8')); continue; }
    if (boQuaDo && KIEM) { outCua.set(p, fs.readFileSync(`${p}.out`, 'utf8')); continue; }
    const r = spawnSync(TSX, [p], { cwd: path.dirname(p), encoding: 'utf8', timeout: laThoiGian ? 600000 : 30000, maxBuffer: 64 << 20 });
    chay++;
    if (r.status !== 0) { loi++; console.log(`❌ ${rel} (exit ${r.status}${r.signal ? ' ' + r.signal : ''})\n${(r.stderr || '').slice(0, 1500)}`); continue; }
    ghiHoacSo(p, r.stdout, laThoiGian);
    console.log(`✓ ${rel}`);
  } else if (p.endsWith('.java')) {
    if (boQuaDo) { outCua.set(p, fs.readFileSync(`${p}.out`, 'utf8')); continue; }
    const lop = path.basename(p, '.java');
    const outDir = path.join(TAM, rel.replace(/[\\/]/g, '_'));
    fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });
    const c = spawnSync('javac', ['--release', '17', '-encoding', 'UTF-8', '-d', outDir, p], { encoding: 'utf8', timeout: 60000 });
    if (c.status !== 0) { loi++; console.log(`❌ javac ${rel}\n${(c.stderr || '').slice(0, 1500)}`); continue; }
    const r = spawnSync('java', ['-Xss64m', '-cp', outDir, lop], { cwd: path.dirname(p), encoding: 'utf8', timeout: laThoiGian ? 600000 : 30000, maxBuffer: 64 << 20 });
    chay++;
    if (r.status !== 0) { loi++; console.log(`❌ java ${rel} (exit ${r.status})\n${(r.stderr || '').slice(0, 1500)}`); continue; }
    ghiHoacSo(p, r.stdout, laThoiGian);
    console.log(`✓ ${rel}`);
  } else if (p.endsWith('.sim.js')) {
    const kq = chaySim(src);
    chay++;
    if (!kq.ok) { loi++; console.log(`❌ sim ${rel}: ${kq.error}`); continue; }
    const buoc = kq.commands.filter((c) => c.op === 'delay').length;
    if (buoc < 4) { loi++; console.log(`❌ sim ${rel}: chỉ ${buoc} bước (cần ≥ 4 Tracer.delay())`); continue; }
    console.log(`✓ ${rel} (${buoc} bước, ${kq.commands.length} lệnh)`);
  }
}

// Cặp TS ↔ Java phải ra cùng kết quả.
for (const [p, out] of outCua) {
  if (!p.endsWith('.ts')) continue;
  const src = fs.readFileSync(p, 'utf8');
  if (/\/\/\s*@thoi-gian\b/.test(src)) continue;
  const m = src.match(/\/\/\s*@java:\s*(\S+\.java)/);
  if (!m) continue;
  const jp = path.join(path.dirname(p), m[1]);
  const jout = outCua.get(jp) ?? (fs.existsSync(`${jp}.out`) ? fs.readFileSync(`${jp}.out`, 'utf8') : null);
  if (jout == null) { lech++; console.log(`❌ ${path.relative(DIR, p)}: không có output của ${m[1]}`); continue; }
  if (rutGon(out) !== rutGon(jout)) {
    lech++;
    console.log(`❌ TS ≠ Java: ${path.relative(DIR, p)} vs ${m[1]}\n--- ts\n${out.slice(0, 600)}\n--- java\n${jout.slice(0, 600)}`);
  }
}

console.log(`${loi || lech ? '❌' : '✅'} ${chay} tệp đã chạy · ${loi} lỗi chạy · ${lech} lệch output/cặp`);
process.exit(loi || lech ? 1 : 0);

/** Chạy một chương trình mô phỏng trong đúng worker của /algorithms (frontend/src/components/algorithms/engine.ts). */
function chaySim(code) {
  const eng = fs.readFileSync(path.join(REPO, 'frontend/src/components/algorithms/engine.ts'), 'utf8');
  const a = eng.indexOf('const WORKER_SRC = `');
  const b = eng.indexOf('\n`;', a);
  if (a < 0 || b < 0) return { ok: false, error: 'không trích được WORKER_SRC từ engine.ts' };
  const raw = eng.slice(a + 'const WORKER_SRC = `'.length, b + 1);
  const workerSrc = new Function('return `' + raw + '`')();
  let kq = null;
  const self = { onmessage: null, postMessage: (m) => { kq = m; } };
  new Function('self', workerSrc)(self);
  self.onmessage({ data: { code } });
  return kq ?? { ok: false, error: 'worker không trả lời' };
}
