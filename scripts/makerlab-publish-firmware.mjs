#!/usr/bin/env node
/**
 * ============================================================
 * Xuất bản một bản build firmware cho Mini-Me Robot
 * ============================================================
 *
 *   node scripts/makerlab-publish-firmware.mjs --version 0.3.0 \
 *        --notes "Thêm OTA" [--build] [--dry]
 *
 * Việc nó làm: (tuỳ chọn) biên dịch → đẩy .bin lên server → server tự
 * băm SHA-256, tự đẩy R2, tự ghi bản ghi. Xong là bo hỏi
 * `/firmware/mini-me-robot/latest` sẽ thấy bản mới.
 *
 * ── Vì sao KHÔNG tự đẩy thẳng lên R2 từ đây ──
 *
 * Khoá bucket R2 nằm trên VPS, không có trên máy lập trình. Bắt script
 * này tự đẩy nghĩa là phải phát tán khoá bucket ra máy cá nhân — đổi
 * lấy đúng một chút tiện, mà mất hẳn một lớp bảo vệ. Nên file đi qua
 * server, và server là nơi duy nhất giữ khoá.
 *
 * ── Vì sao SHA-256 tính ở SERVER, không phải ở đây ──
 *
 * Băm là thứ bo dùng để quyết định có nạp hay không. Nếu server tin
 * theo con số script này gửi lên thì cái băm chỉ chứng minh "file khớp
 * với thứ script NÓI", chứ không chứng minh "file nguyên vẹn". Tính
 * lại trên đúng byte vừa nhận mới có nghĩa.
 *
 * ⚠️ Phiên bản phải KHỚP `FW_VERSION` trong secrets.h của bản vừa
 * build. Lệch nhau thì bo nạp xong vẫn tưởng mình là bản cũ và lần sau
 * lại nạp lại — vòng lặp không hồi kết.
 */
import { existsSync, readFileSync, statSync } from 'fs';
import { createHash } from 'crypto';
import { execSync } from 'child_process';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const FW_DIR = path.join(ROOT, 'firmware', 'mini-me-robot');
const BIN = path.join(FW_DIR, '.pio', 'build', 'mini-me', 'firmware.bin');
const SECRETS = path.join(FW_DIR, 'src', 'secrets.h');

const args = process.argv.slice(2);
const arg = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (n) => args.includes(`--${n}`);

const API = process.env.MAKERLAB_API || 'https://cuongthai.com/api/v1/maker-lab';
const TOKEN = process.env.MAKERLAB_ADMIN_TOKEN;
const PROJECT_ID = Number(process.env.MAKERLAB_PROJECT_ID || 1);

function die(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

// ── Phiên bản: lấy từ secrets.h nếu không truyền tay ──
function versionTuSecrets() {
  if (!existsSync(SECRETS)) return null;
  const m = /#define\s+FW_VERSION\s+"([^"]+)"/.exec(readFileSync(SECRETS, 'utf8'));
  return m ? m[1] : null;
}

const vSecrets = versionTuSecrets();
const version = arg('version') || vSecrets;
if (!version) die('Thiếu --version, và cũng không đọc được FW_VERSION từ secrets.h');

// Cảnh báo chứ không chặn: có lúc người ta cố ý đặt tên bản khác.
if (vSecrets && version !== vSecrets) {
  console.warn(
    `\n⚠️  --version "${version}" KHÁC FW_VERSION "${vSecrets}" trong secrets.h.\n` +
      `   Bo nạp xong sẽ tự khai là "${vSecrets}", nên lần sau nó lại thấy\n` +
      `   server có bản "${version}" và nạp lại — vòng lặp không hồi kết.\n`,
  );
}

// ── Biên dịch nếu được yêu cầu ──
if (has('build')) {
  console.log('▶ Biên dịch…');
  try {
    execSync('pio run', {
      cwd: FW_DIR,
      stdio: 'inherit',
      env: { ...process.env, PATH: `${process.env.HOME}/.platformio/penv/bin:${process.env.PATH}` },
    });
  } catch {
    die('Biên dịch hỏng — sửa lỗi rồi chạy lại');
  }
}

if (!existsSync(BIN)) die(`Không thấy ${BIN}\n   Chạy lại với --build, hoặc tự "pio run" trước`);

const st = statSync(BIN);
const buf = readFileSync(BIN);
const sha = createHash('sha256').update(buf).digest('hex');

console.log('');
console.log(`  file     ${path.relative(ROOT, BIN)}`);
console.log(`  version  ${version}`);
console.log(`  cỡ       ${(st.size / 1024).toFixed(0)} KB`);
console.log(`  sha256   ${sha}`);
console.log(`  build    ${st.mtime.toLocaleString('vi-VN')}`);
console.log('');

if (has('dry')) {
  console.log('— chạy thử, không gửi đi đâu cả —\n');
  process.exit(0);
}
if (!TOKEN) {
  die(
    'Thiếu MAKERLAB_ADMIN_TOKEN.\n' +
      '   Lấy bằng cách đăng nhập cuongthai.com rồi copy cookie `backend_token`,\n' +
      '   hoặc:  export MAKERLAB_ADMIN_TOKEN="..."',
  );
}

// ── Gửi lên ──
const form = new FormData();
form.append('version', version);
if (arg('notes')) form.append('releaseNotes', arg('notes'));
form.append('file', new Blob([buf], { type: 'application/octet-stream' }), `${version}.bin`);

console.log(`▶ Đẩy lên ${API}/admin/projects/${PROJECT_ID}/firmware/upload …`);
const res = await fetch(`${API}/admin/projects/${PROJECT_ID}/firmware/upload`, {
  method: 'POST',
  headers: { cookie: `backend_token=${TOKEN}`, authorization: `Bearer ${TOKEN}` },
  body: form,
});

const body = await res.json().catch(() => ({}));
if (!res.ok || !body.success) {
  die(`Server trả HTTP ${res.status}: ${body.message || JSON.stringify(body).slice(0, 200)}`);
}

// Đối chiếu băm server tính với băm ta tự tính — hai bên phải khớp,
// lệch nghĩa là file đã méo trên đường truyền.
if (body.data?.sha256 && body.data.sha256 !== sha) {
  die(
    `SHA-256 lệch nhau!\n   ta tính   ${sha}\n   server    ${body.data.sha256}\n` +
      `   File đã méo trên đường truyền — ĐỪNG nạp bản này.`,
  );
}

console.log('');
console.log('✅ Đã xuất bản.');
console.log(`   url  ${body.data?.url ?? '(server không trả url)'}`);
console.log('');
console.log('   Giờ vào tab Điều khiển bấm "Cập nhật firmware", hoặc gửi lệnh:');
console.log(`   {"type":"ota"}`);
console.log('');
