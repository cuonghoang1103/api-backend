// Khoá TypeScript — sinh content/courses/typescript/sNN/_ma-<deck>.mjs từ dự án LabFlow TS chạy thật.
//   node scripts/ts/sinh-ma.mjs <map.json>
// map.json: { "duAn": "<thư mục labflow-ts>", "out": "<thư mục *.txt do scripts/ts/chay.sh tạo>", "dich": "content/courses/typescript/s01/_ma-ts-01-1.mjs",
//             "bai": "1.1", "code": { "khoá": "đường/dẫn/tương/đối/trong/dự/án.ts", … } }
// CODE[khoá] = nội dung file; OUT['<tên file .txt>'] = output (bỏ dòng "[exit N]" cuối, bỏ mã màu ANSI). Thoát \ ` ${ cho template literal.
// Trước khi ghi: chặn nếu output có dấu hiệu bí mật (TOKEN|KEY|SECRET|sk-|ctw_) hoặc đường dẫn máy (/Users/, /private/).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
const map = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const ansi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
const BAD = /TOKEN|SECRET|\bsk-|ctw_|\/Users\/|\/private\/|API_KEY|R2_/;
const L = ['/**', ` * _ma (bài ${map.bai}) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.`, ' */', 'export const CODE = {'];
const loi = [];
for (const [k, rel] of Object.entries(map.code || {})) {
  const s = readFileSync(path.join(map.duAn, rel), 'utf8').replace(/\n+$/, '');
  if (BAD.test(s)) loi.push(`CODE.${k}: ${BAD.exec(s)[0]}`);
  L.push(`  ${JSON.stringify(k)}: \`${esc(s)}\`,`);
}
L.push('};', 'export const OUT = {');
for (const f of readdirSync(map.out).filter((f) => f.endsWith('.txt')).sort()) {
  const s = ansi(readFileSync(path.join(map.out, f), 'utf8')).replace(/\n+$/, '').replace(/\n?\[exit \d+\]$/, '').replace(/\n+$/, '');
  if (BAD.test(s)) loi.push(`OUT.${f}: ${BAD.exec(s)[0]}`);
  L.push(`  '${f.slice(0, -4)}': \`${esc(s)}\`,`);
}
L.push('};');
if (loi.length) { console.error('✗ dừng — nghi lộ bí mật/đường dẫn máy:\n  ' + loi.join('\n  ')); process.exit(1); }
writeFileSync(map.dich, L.join('\n') + '\n');
console.log('✓', map.dich, Object.keys(map.code || {}).length, 'CODE', readdirSync(map.out).filter((f) => f.endsWith('.txt')).length, 'OUT');
