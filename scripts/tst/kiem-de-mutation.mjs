// Khoá Testing — kiểm ĐỀ Code Lab kiểu mutation: test tham khảo phải xanh trên code đúng, mỗi đột biến phải khớp ĐÚNG 1 chỗ
// và làm test tham khảo ĐỎ (nếu "sống" ⇒ đột biến tương đương hoặc test tham khảo thiếu ⇒ sửa đề trước khi đổ vào Code Lab).
//   cp -r content/courses/testing/_labflow-lite <scratch>/labflow-lite && (cd <scratch>/labflow-lite && npm ci)
//   node scripts/tst/kiem-de-mutation.mjs <scratch>/labflow-lite content/courses/testing/_de-codelab-mutation.json [id…]
// Luôn trả file về trong finally. Cần Node 22 (TST_NODE_BIN như chay.sh).
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const [duAn, specPath, ...chi] = process.argv.slice(2);
const { de } = JSON.parse(readFileSync(path.resolve(specPath), 'utf8'));
process.chdir(duAn);
const env = { ...process.env, PATH: (process.env.TST_NODE_BIN ? process.env.TST_NODE_BIN + path.delimiter : '') + process.env.PATH };
let cfg = [];
const run = (t) => spawnSync('npx', ['vitest', 'run', ...cfg, ...t], { encoding: 'utf8', env, shell: process.platform === 'win32' }).status;
let song = 0, tong = 0;
for (const d of de.filter((x) => !chi.length || chi.includes(x.id))) {
  cfg = d.config ? ['--config', d.config] : [];   // vd vitest.integration.config.js cho Chương 4 (cần Docker)
  if (run(d.testThamKhao) !== 0) throw new Error(d.id + ': test tham khảo KHÔNG xanh trên code đúng');
  for (const m of d.dotBien) {
    const goc = readFileSync(m.file, 'utf8');
    const n = goc.split(m.from).length - 1;
    if (n !== 1) throw new Error(`${d.id}: "${m.from}" khớp ${n} chỗ trong ${m.file}`);
    writeFileSync(m.file, goc.replace(m.from, m.to));
    let st; try { st = run(d.testThamKhao); } finally { writeFileSync(m.file, goc); }
    tong++; if (st === 0) song++;
    console.log((st !== 0 ? '✔ diệt ' : '✘ SỐNG ') + d.id + ' · ' + m.label);
  }
  // voHai: thay đổi VÔ HẠI (refactor) — test tham khảo phải VẪN XANH, nếu đỏ là test quá chi tiết.
  for (const m of d.voHai ?? []) {
    const goc = readFileSync(m.file, 'utf8');
    if (goc.split(m.from).length - 1 !== 1) throw new Error(`${d.id}: "${m.from}" không khớp đúng 1 chỗ trong ${m.file}`);
    writeFileSync(m.file, goc.replace(m.from, m.to));
    let st; try { st = run(d.testThamKhao); } finally { writeFileSync(m.file, goc); }
    tong++; if (st !== 0) song++;
    console.log((st === 0 ? '✔ vẫn xanh ' : '✘ ĐỎ (giòn) ') + d.id + ' · ' + m.label);
  }
}
console.log(`\n${tong - song}/${tong} đạt (đột biến bị diệt + thay đổi vô hại vẫn xanh)`);
process.exitCode = song ? 1 : 0;
