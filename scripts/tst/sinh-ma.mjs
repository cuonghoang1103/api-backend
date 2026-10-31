// Khoá Testing — sinh content/courses/testing/sNN/_ma.mjs từ dự án chạy thật (thay gen-ma*.py của đợt mẫu).
//   node scripts/tst/sinh-ma.mjs <map.json>
// map.json: { "duAn": "<thư mục dự án>", "out": "<thư mục *.txt do chay.sh tạo>", "dich": "content/courses/testing/s03/_ma.mjs",
//             "chuong": 3, "code": { "khoá": "đường/dẫn/tương/đối/trong/dự/án.js", … } }
// CODE[khoá] = nội dung file; OUT['<tên file .txt>'] = output (bỏ dòng "[exit N]" cuối). Thoát \ ` ${ cho template literal.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
const map = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const L = ['/**', ` * _ma.mjs (Chương ${map.chuong}) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.`, ' */', 'export const CODE = {'];
for (const [k, rel] of Object.entries(map.code)) L.push(`  ${k}: \`${esc(readFileSync(path.join(map.duAn, rel), 'utf8').replace(/\n+$/, ''))}\`,`);
L.push('};', 'export const OUT = {');
for (const f of readdirSync(map.out).filter((f) => f.endsWith('.txt')).sort()) {
  const s = readFileSync(path.join(map.out, f), 'utf8').replace(/\n+$/, '').replace(/\n?\[exit \d+\]$/, '').replace(/\n+$/, '');
  L.push(`  '${f.slice(0, -4)}': \`${esc(s)}\`,`);
}
L.push('};');
writeFileSync(map.dich, L.join('\n') + '\n');
console.log('✓', map.dich, Object.keys(map.code).length, 'CODE');
