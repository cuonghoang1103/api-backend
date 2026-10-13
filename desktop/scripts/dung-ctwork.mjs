#!/usr/bin/env node
/**
 * Dựng app desktop RIÊNG của CT Work (13/10/2026) — xem src/shared/bienThe.ts.
 *
 *   node scripts/dung-ctwork.mjs build            # chỉ vite (renderer + main) vào dist-ctwork/
 *   node scripts/dung-ctwork.mjs pack             # + electron-builder --dir (thử nhanh, không nén)
 *   node scripts/dung-ctwork.mjs dist --mac       # + bản cài macOS (chưa ký)
 *   node scripts/dung-ctwork.mjs dist --win | --linux
 *   (mọi tham số sau cùng chuyển thẳng cho electron-builder, vd. `--publish never`)
 *
 * Vì sao là script chứ không phải `CT_BIEN_THE=ctwork npm run build` trong
 * package.json: cú pháp gán biến trước lệnh KHÔNG chạy trên cmd.exe của runner
 * Windows. Đặt biến bằng `env` của `spawn` thì chạy như nhau trên cả ba nền.
 *
 * Số phiên bản của app CT Work đi RIÊNG (`ctworkVersion` trong package.json) —
 * app CuongThai đang ở 0.5.x và bump nhiều lần mỗi ngày; app CT Work bắt đầu từ
 * 1.0.0 và chỉ bump khi phát hành chính nó. Ghi đè bằng
 * `-c.extraMetadata.version`, nên bản cài, `app.getVersion()` và `latest*.yml`
 * cùng một số.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(path.join(goc, 'package.json'), 'utf8'));
const phienBan = process.env.CTWORK_VERSION || pkg.ctworkVersion;
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.]+)?$/.test(String(phienBan))) {
  console.error(`❌ ctworkVersion không hợp lệ: ${phienBan}`);
  process.exit(1);
}

const [viec = 'build', ...thamSo] = process.argv.slice(2);
const env = { ...process.env, CT_BIEN_THE: 'ctwork' };
const node = process.execPath;

function chay(lenh, args, them = {}) {
  console.log(`\n▶ ${path.basename(lenh)} ${args.join(' ')}`);
  const r = spawnSync(lenh, args, { cwd: goc, env: { ...env, ...them }, stdio: 'inherit', shell: false });
  if (r.status !== 0) {
    console.error(`❌ Hỏng (mã ${r.status ?? r.signal})`);
    process.exit(r.status ?? 1);
  }
}

console.log(`CT Work desktop ${phienBan} — biến thể ctwork → dist-ctwork/`);
chay(node, ['--max-old-space-size=6144', path.join(goc, 'node_modules/vite/bin/vite.js'), 'build']);
chay(node, [path.join(goc, 'node_modules/vite/bin/vite.js'), 'build', '--config', 'vite.main.config.ts']);

if (viec === 'build') process.exit(0);

const eb = path.join(goc, 'node_modules/electron-builder/cli.js');
const chung = ['--config', 'electron-builder.ctwork.yml', `-c.extraMetadata.version=${phienBan}`];
if (viec === 'pack') {
  chay(node, [eb, ...chung, '--dir', ...thamSo], { CSC_IDENTITY_AUTO_DISCOVERY: 'false' });
} else if (viec === 'dist') {
  // Mặc định KHÔNG ký (như `dist:mac` của app CuongThai) — trừ khi người gọi tự đặt biến.
  const ky = process.env.CSC_IDENTITY_AUTO_DISCOVERY ?? 'false';
  chay(node, [eb, ...chung, ...thamSo], { CSC_IDENTITY_AUTO_DISCOVERY: ky });
} else {
  console.error(`❌ Không hiểu việc "${viec}" — dùng build | pack | dist`);
  process.exit(1);
}
