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
import { existsSync, readFileSync, statSync, writeFileSync } from 'fs';
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

/**
 * ⚠️ Đường ADMIN là `/api/v1/admin/maker-lab`, KHÔNG phải
 * `/api/v1/maker-lab/admin`.
 *
 * Hai router gắn ở hai gốc khác nhau trong index.ts:
 *     app.use('/api/v1/maker-lab',        makerLabRoutes);
 *     app.use('/api/v1/admin/maker-lab',  makerLabAdminRoutes);
 *
 * Đoán nhầm theo trực giác "admin là nhánh con" thì được 404 — mà 404
 * ở đây trông y hệt "route chưa deploy", nên rất dễ đi truy nhầm sang
 * phía hạ tầng. Đúng cái bẫy đã dính ngay lần kiểm đầu tiên 11/08.
 */
const API_ADMIN =
  process.env.MAKERLAB_ADMIN_API || 'https://cuongthai.com/api/v1/admin/maker-lab';
const PROJECT_ID = Number(process.env.MAKERLAB_PROJECT_ID || 1);

/**
 * Token lấy theo thứ tự: biến môi trường → file `.makerlab-token` ở
 * gốc repo (đã gitignore).
 *
 * Vì sao đọc từ file: token sống 24 giờ, nên bắt `export` lại mỗi phiên
 * terminal là một bước thừa mà ai cũng quên, rồi nhận về một lỗi khó
 * hiểu. Ghi một lần vào file, script tự đọc.
 *
 * Vì sao KHÔNG bỏ luôn token: xuất bản firmware là thao tác nguy hiểm
 * nhất trong hệ thống — nó bảo server "đặt tệp này vào chỗ robot sẽ tải
 * về và CHẠY". Không có token thì ai biết địa chỉ cũng đẩy được mã của
 * họ vào robot trong nhà bạn.
 */
const TOKEN_FILE = path.join(ROOT, '.makerlab-token');
function docToken() {
  if (process.env.MAKERLAB_ADMIN_TOKEN) return process.env.MAKERLAB_ADMIN_TOKEN.trim();
  if (existsSync(TOKEN_FILE)) return readFileSync(TOKEN_FILE, 'utf8').trim();
  return undefined;
}

/** Token là JWT — đọc được hạn dùng mà không cần gọi server. */
function tokenConHan(t) {
  try {
    const p = JSON.parse(Buffer.from(t.split('.')[1], 'base64').toString());
    return typeof p.exp === 'number' ? p.exp * 1000 - Date.now() : null;
  } catch {
    return null;
  }
}

const TOKEN = docToken();

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

/**
 * Tự tăng số cuối của phiên bản rồi GHI LẠI vào secrets.h.
 *
 * Vì sao tự động: bắt người ta nhớ "sửa FW_VERSION trong secrets.h
 * trước khi chạy" là bắt nhớ một bước vô hình. Quên là bo nạp xong vẫn
 * tự khai bản cũ, rồi lần sau lại thấy "có bản mới" và nạp lại — vòng
 * lặp không hồi kết, mà triệu chứng thì mơ hồ ("sao nó cứ cập nhật
 * hoài?").
 *
 * Máy nhớ hộ được thì đừng bắt người nhớ.
 *
 * "0.2.3-hdr" → "0.2.4-hdr" · "1.4" → "1.5" · không có số → thêm "-2"
 */
function tangVersion(v) {
  const m = /^(.*?)(\d+)([^0-9]*)$/.exec(v);
  return m ? `${m[1]}${Number(m[2]) + 1}${m[3]}` : `${v}-2`;
}

function ghiVersion(v) {
  const s = readFileSync(SECRETS, 'utf8');
  const moi = s.replace(/(#define\s+FW_VERSION\s+")[^"]+(")/, `$1${v}$2`);
  if (moi === s) die(`Không thay được FW_VERSION trong ${SECRETS}`);
  writeFileSync(SECRETS, moi);
}

const vSecrets = versionTuSecrets();
let version;

if (arg('version')) {
  version = arg('version');
} else if (has('giu-version')) {
  version = vSecrets;
  if (!version) die('Không đọc được FW_VERSION từ secrets.h');
} else {
  if (!vSecrets) die('Không đọc được FW_VERSION từ secrets.h — truyền --version');
  version = tangVersion(vSecrets);
  console.log(`▶ Tăng phiên bản: ${vSecrets} → ${version}`);
}

// Ghi vào secrets.h TRƯỚC khi build, để bản .bin mang đúng số nó khai.
// Ghi sau khi build là bo nạp xong khai một đằng, server ghi một nẻo.
if (version !== vSecrets && !has('dry')) ghiVersion(version);

// ── Biên dịch: MẶC ĐỊNH có, `--khong-build` để bỏ qua ──
//
// Đảo mặc định vì gần như lần nào cũng muốn build: vừa sửa mã xong mới
// chạy script này. Để `--build` là tuỳ chọn thì quên một lần là đẩy lên
// đúng bản .bin CŨ, mà tên phiên bản lại mới — sai lệch im lặng, không
// có gì báo, và bo nạp xong vẫn hành xử y như trước.
if (!has('khong-build')) {
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

const URL_UP = `${API_ADMIN}/projects/${PROJECT_ID}/firmware/upload`;
console.log(`▶ Đẩy lên ${URL_UP} …`);
const res = await fetch(URL_UP, {
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
