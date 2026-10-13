#!/usr/bin/env node
/**
 * Phát hành CẢ HAI app desktop một lần (13/10/2026):
 *
 *   npm run phat-hanh:ca-hai -- "mô tả ngắn"
 *
 * Dùng khi đổi thứ nằm trong CẢ HAI app — thực tế là mọi thay đổi GIAO DIỆN
 * CT Work (`frontend/src/app/work`, `frontend/src/components/work`): app CuongThai
 * có CT Work bên trong, app CT Work là chính nó, và cả hai gói sẵn giao diện lúc
 * dựng. Thay đổi chỉ ở backend thì KHÔNG cần phát hành app nào — deploy là đủ.
 *
 * Làm tuần tự: app CT Work trước, rồi app CuongThai — mỗi lượt đi qua TOÀN BỘ
 * chốt chặn của `phat-hanh.mjs` (nhánh, cây sạch, không dựng chồng, kiểm đủ tệp).
 * Lượt đầu hỏng thì DỪNG, không phát hành nửa vời app thứ hai.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'phat-hanh.mjs');
const thamSo = process.argv.slice(2).filter((t) => t !== '--ctwork');

for (const [ten, them] of [['app CT Work', ['--ctwork']], ['app CuongThai', []]]) {
  console.log(`\n━━━ ${ten} ━━━`);
  const r = spawnSync(process.execPath, [script, ...them, ...thamSo], { stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`\n❌ Dừng ở ${ten} (mã ${r.status ?? r.signal}) — app còn lại CHƯA phát hành.`);
    process.exit(r.status ?? 1);
  }
}
console.log('\n✓ Đã phát hành cả hai app.');
