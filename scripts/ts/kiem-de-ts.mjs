// Khoá TypeScript — kiểm đề Code Lab kiểu "ts" (chưa có máy chấm trên web; đây là máy chấm mẫu chạy bằng tsc + node thật).
//   node scripts/ts/kiem-de-ts.mjs <thư mục labflow-ts (đã npm ci)> content/courses/typescript/_de-codelab-ts.json [id…]
// Với MỖI đề, trong một thư mục tạm bên trong dự án (để tsconfig gốc + node_modules/@types/node được dùng chung):
//   1. lời giải (loiGiai)  ⇒ PHẢI qua mọi phép chấm;
//   2. mã khởi đầu (khoiDau) ⇒ PHẢI trượt ít nhất một phép (đề không cho điểm khi chưa làm gì);
//   3. mỗi bài làm sai mẫu (saiMau) ⇒ PHẢI trượt (bộ chấm bắt được lối tắt hay gặp: any, string thay literal…).
// Phép chấm của một đề (kiem):
//   sach:   [đường dẫn]  tsc trên tệp của người học + các tệp này: 0 lỗi
//   phaiLoi:[đường dẫn]  dòng nào kết thúc bằng "// expect TSxxxx" phải có lỗi đúng mã đó; dòng khác trong tệp: 0 lỗi
//   loiTsc: [mã]         (đề "đọc lỗi") tsc trên tệp người học phải ra ĐÚNG tập mã này (vd ["TS2322"]); [] = phải sạch
//   chay:   [lệnh]       chạy bằng Node 22 trong thư mục tạm, exit 0 (vd "node --test test/x.test.ts", "node src/main.ts")
//   ra:     "chuỗi"      (tuỳ chọn) stdout của lệnh chay đầu tiên phải CHỨA chuỗi này
//   cam:    [regex]      regex cấm trong tệp người học (mặc định: \bany\b, @ts-ignore, @ts-nocheck, @ts-expect-error)
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const [duAnArg, deArg, ...chon] = process.argv.slice(2);
const duAn = path.resolve(duAnArg);
const ds = JSON.parse(readFileSync(deArg, 'utf8')).filter((d) => !chon.length || chon.includes(d.id));
const TSC = process.env.KIEM_TSC || path.join(duAn, 'node_modules/.bin/tsc');   // KIEM_TSC=<tsc khác> để so (vd TypeScript 6.0.3 — bản máy chấm web sẽ dùng)
const CAM = ['\\bany\\b', '@ts-ignore', '@ts-nocheck', '@ts-expect-error'];

function sh(cmd, args, cwd) {
  try { return { code: 0, out: execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: 'pipe', env: { PATH: path.dirname(process.execPath) + ':/usr/bin:/bin', HOME: cwd, NO_COLOR: '1', TZ: 'UTC' } }) }; }
  catch (e) { return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') }; }
}
const loiCua = (out) => out.split('\n').map((l) => /^(.+?)\((\d+),\d+\): error (TS\d+)/.exec(l)).filter(Boolean).map((m) => ({ f: m[1], d: +m[2], ma: m[3] }));

function cham(de, tep) {
  const dir = path.join(duAn, '.kiem-de', de.id);
  rmSync(dir, { recursive: true, force: true });
  const viet = (rel, s) => { mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); writeFileSync(path.join(dir, rel), s); };
  for (const [rel, s] of Object.entries({ ...(de.coDinh || {}), ...tep })) viet(rel, s);
  const hoc = Object.keys(tep);
  const k = de.kiem;
  const truot = [];
  const tsc = (files) => {
    writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({ extends: path.join(duAn, 'tsconfig.json'), compilerOptions: { types: ['node'] }, include: files }));
    return sh(TSC, ['-p', 'tsconfig.json'], dir);
  };
  if (k.sach) { const r = tsc([...hoc, ...k.sach]); if (r.code) truot.push('sach: ' + r.out.trim().split('\n')[0]); }
  if (k.loiTsc) {
    const r = loiCua(tsc(hoc).out).map((e) => e.ma);
    const a = [...new Set(r)].sort().join(','), b = [...new Set(k.loiTsc)].sort().join(',');
    if (a !== b) truot.push(`loiTsc: muốn [${b}], được [${a}]`);
  }
  for (const f of k.phaiLoi || []) {
    const loi = loiCua(tsc([...hoc, f]).out);
    const dong = readFileSync(path.join(dir, f), 'utf8').split('\n');
    dong.forEach((t, i) => {
      const m = /\/\/ expect (TS\d+)\s*$/.exec(t);
      const o = loi.filter((e) => e.f === f && e.d === i + 1).map((e) => e.ma);
      if (m && !o.includes(m[1])) truot.push(`phaiLoi ${f}:${i + 1} muốn ${m[1]}, được ${o.join(',') || 'không lỗi'}`);
      if (!m && o.length) truot.push(`phaiLoi ${f}:${i + 1} lỗi lạ ${o.join(',')}`);
    });
  }
  let dau = true;
  for (const lenh of k.chay || []) {
    const [cmd, ...args] = lenh.split(' ');
    const r = sh(cmd === 'node' ? process.execPath : cmd, args, dir);
    if (r.code) truot.push(`chay "${lenh}" exit ${r.code}: ${r.out.trim().split('\n').find((l) => /Error|✖|fail/.test(l)) || ''}`);
    if (dau && k.ra && !r.out.includes(k.ra)) truot.push(`ra: thiếu "${k.ra}"`);
    dau = false;
  }
  const re = (k.cam || CAM).map((s) => new RegExp(s));
  for (const f of hoc) for (const r of re) if (r.test(tep[f])) truot.push(`cam: ${r.source} trong ${f}`);
  rmSync(dir, { recursive: true, force: true });
  return truot;
}

let hong = 0, nSai = 0;
for (const de of ds) {
  const a = cham(de, de.loiGiai);
  const b = cham(de, de.khoiDau);
  const c = (de.saiMau || []).map((s) => [s.nhan, cham(de, { ...de.khoiDau, ...s.tep })]);
  nSai += c.length;
  const ok = !a.length && b.length && c.every(([, t]) => t.length);
  if (!ok) hong++;
  console.log(`${ok ? '✓' : '✗'} ${de.id} — lời giải ${a.length ? '✗ ' + a.join(' | ') : 'qua'} · khởi đầu ${b.length ? 'trượt (' + b.length + ')' : '✗ QUA (đề hỏng)'} · sai mẫu ${c.filter(([, t]) => t.length).length}/${c.length} bị bắt` +
    c.filter(([, t]) => !t.length).map(([n]) => `\n    ✗ sai mẫu lọt: ${n}`).join(''));
}
rmSync(path.join(duAn, '.kiem-de'), { recursive: true, force: true });
console.log(`\n${hong ? '✗' : '✓'} ${ds.length} đề, ${nSai} bài sai mẫu — ${hong} đề có vấn đề`);
process.exit(hong ? 1 : 0);
