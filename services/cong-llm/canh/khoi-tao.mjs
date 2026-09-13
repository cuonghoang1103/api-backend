// ─── Khởi tạo New API cho cổng key con — chạy lại bao nhiêu lần cũng được ─
//
//   docker exec cuonghoangdev_canh_llm node /app/khoi-tao.mjs            # dựng/cập nhật
//   docker exec cuonghoangdev_canh_llm node /app/khoi-tao.mjs --in-khoa  # + in key con ra màn hình
//
// Làm những việc mà bấm tay trong giao diện thì dễ sót một bước:
//   1. tạo tài khoản quản trị (lần đầu), TẮT đăng ký tài khoản
//   2. tắt "tự vô hiệu kênh khi lỗi" — một lần rambo trả 5xx không được phép
//      khoá cổng key con vĩnh viễn
//   3. giá model theo bảng Anthropic để hạn mức key con tính ra USD quy đổi
//   4. một kênh Anthropic duy nhất trỏ vào CANH (không trỏ thẳng rambo)
//   5. các key con ghi trong KEY_CON (chỉ tạo key còn thiếu, không đụng key đã có)

import { readFileSync } from 'node:fs';

const env = process.env;
const NEWAPI_URL = (env.NEWAPI_URL || 'http://cuonghoangdev_newapi:3000').replace(/\/+$/, '');
const NEWAPI_USER = env.NEWAPI_USER || 'quantri';
const NEWAPI_PASS = env.NEWAPI_PASS;
const KHOA_NOI_BO = env.CANH_KHOA_NOI_BO;
const CANH_URL = (env.CANH_URL || 'http://cuonghoangdev_canh_llm:8080').replace(/\/+$/, '');
const KEY_CON = (env.KEY_CON || 'opencode-1,opencode-2,web-phu-1')
  .split(',')
  .map((x) => x.trim())
  .filter(Boolean);
const IN_KHOA = process.argv.includes('--in-khoa');
const TEN_KENH = 'rambo-qua-canh';
const QUOTA_MOT_USD = 500_000;

// Sáu model của rambo (src/services/agent/models.ts). Tỉ lệ New API: 1 = 2 USD
// mỗi triệu token vào ⇒ tỉ lệ = giá vào Anthropic / 2. Ra gấp 5 lần vào, đọc
// cache 0,1, ghi cache 1,25 — đúng cho cả sáu.
const MODEL = {
  'claude-haiku-4-5': 0.5,
  'claude-sonnet-4-6': 1.5,
  'claude-sonnet-5': 1,
  'claude-opus-4-6': 2.5,
  'claude-opus-4-7': 2.5,
  'claude-opus-4-8': 2.5,
};

if (!NEWAPI_PASS || !KHOA_NOI_BO) {
  console.error('Thiếu NEWAPI_PASS hoặc CANH_KHOA_NOI_BO.');
  process.exit(1);
}

let phien;
async function goi(duong, { method = 'GET', body, anDanh = false } = {}) {
  const headers = { 'content-type': 'application/json' };
  if (!anDanh) {
    headers.authorization = `Bearer ${phien.jwt}`;
    headers['New-Api-User'] = String(phien.userId);
  }
  const r = await fetch(`${NEWAPI_URL}${duong}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!d.success) throw new Error(`${method} ${duong}: ${d.message || `HTTP ${r.status}`}`);
  return d.data;
}

async function danhSach(duong) {
  const tatCa = [];
  for (let trang = 1; trang <= 20; trang++) {
    const d = await goi(`${duong}?p=${trang}&page_size=100`);
    const items = Array.isArray(d) ? d : d?.items || [];
    tatCa.push(...items);
    if (items.length < 100) break;
  }
  return tatCa;
}

// 1. Tài khoản quản trị
const setup = await goi('/api/setup', { anDanh: true });
if (!setup?.status) {
  await goi('/api/setup', {
    method: 'POST',
    anDanh: true,
    body: { username: NEWAPI_USER, password: NEWAPI_PASS, confirmPassword: NEWAPI_PASS, SelfUseModeEnabled: true, DemoSiteEnabled: false },
  });
  console.log('✓ đã tạo tài khoản quản trị', NEWAPI_USER);
}
// New API chặn route đăng nhập theo cửa sổ (CRITICAL_RATE_LIMIT). Gặp 429 là
// hết ngạch chứ không phải sai mật khẩu — chờ rồi thử lại, đừng giết cả lượt
// triển khai. `trien-khai.sh` chạy script này MỖI LẦN deploy, mà phần lớn các
// lần thì chẳng có gì để tạo thêm.
let dn = null;
for (let lan = 1; lan <= 6; lan++) {
  try {
    dn = await goi('/api/user/login', { method: 'POST', anDanh: true, body: { username: NEWAPI_USER, password: NEWAPI_PASS } });
    break;
  } catch (e) {
    if (!String(e.message).includes('429') || lan === 6) throw e;
    console.log(`⏳ New API chặn đăng nhập (429), chờ 30s rồi thử lại (${lan}/6)`);
    await new Promise((ok) => setTimeout(ok, 30_000));
  }
}
phien = { jwt: dn.access_token, userId: dn.user?.id ?? 1 };

// 2 + 3. Tuỳ chọn hệ thống
const tuyChon = Object.fromEntries((await goi('/api/option/')).map((o) => [o.key, o.value]));
async function dat(key, value) {
  const v = typeof value === 'string' ? value : JSON.stringify(value);
  if (tuyChon[key] === v) return;
  await goi('/api/option/', { method: 'PUT', body: { key, value: v } });
  console.log(`✓ ${key}`);
}
function tron(key, them) {
  let cu = {};
  try {
    cu = JSON.parse(tuyChon[key] || '{}');
  } catch {
    /* rỗng */
  }
  return { ...cu, ...them };
}
await dat('RegisterEnabled', 'false');
await dat('PasswordRegisterEnabled', 'false');
await dat('AutomaticDisableChannelEnabled', 'false');
const moiModel = (f) => Object.fromEntries(Object.keys(MODEL).map((m) => [m, f(m)]));
await dat('ModelRatio', tron('ModelRatio', moiModel((m) => MODEL[m])));
await dat('CompletionRatio', tron('CompletionRatio', moiModel(() => 5)));
await dat('CacheRatio', tron('CacheRatio', moiModel(() => 0.1)));
await dat('CreateCacheRatio', tron('CreateCacheRatio', moiModel(() => 1.25)));

// Mỗi lượt gọi trừ cả quota của KEY lẫn quota của NGƯỜI SỞ HỮU key. Trần thật
// là ở key (canh nạp lại mỗi cửa sổ); quota người dùng chỉ cần đừng bao giờ cạn.
const toi = await goi('/api/user/self');
const QUOTA_NGUOI = 1_000_000 * QUOTA_MOT_USD;
if (Number(toi.quota) < QUOTA_NGUOI / 2) {
  await goi('/api/user/manage', { method: 'POST', body: { id: toi.id, action: 'add_quota', mode: 'override', value: QUOTA_NGUOI } });
  console.log('✓ quota tài khoản quản trị');
}

// 4. Kênh duy nhất: New API → canh
const kenh = {
  type: 14, // Anthropic
  name: TEN_KENH,
  key: KHOA_NOI_BO,
  base_url: CANH_URL,
  models: Object.keys(MODEL).join(','),
  group: 'default',
  auto_ban: 0,
  status: 1,
};
const kenhCu = (await danhSach('/api/channel/')).find((c) => c.name === TEN_KENH);
if (!kenhCu) {
  await goi('/api/channel/', { method: 'POST', body: { mode: 'single', channel: kenh } });
  console.log('✓ đã tạo kênh', TEN_KENH);
} else {
  // PUT từ chối mọi body có trường `status` ("Invalid parameters") — trạng
  // thái kênh đổi qua đường riêng. Chỉ gửi đúng các trường mình quản lý.
  const { status: _boQua, ...sua } = kenh;
  await goi('/api/channel/', { method: 'PUT', body: { id: kenhCu.id, ...sua } });
  console.log('✓ đã cập nhật kênh', TEN_KENH);
}

// 5. Key con
const hanMuc = JSON.parse(readFileSync(new URL('./han-muc.json', import.meta.url), 'utf8'));
let token = await danhSach('/api/token/');
for (const ten of KEY_CON) {
  if (token.some((t) => t.name === ten)) continue;
  const usd = Number(ten in (hanMuc.theo_ten || {}) ? hanMuc.theo_ten[ten] : hanMuc.mac_dinh_usd);
  await goi('/api/token/', {
    method: 'POST',
    body: { name: ten, remain_quota: Math.round(usd * QUOTA_MOT_USD), unlimited_quota: false, expired_time: -1, model_limits_enabled: false, model_limits: '' },
  });
  console.log(`✓ đã tạo key con ${ten} (${usd} USD/cửa sổ)`);
}
token = await danhSach('/api/token/');
console.log(`Key con hiện có: ${token.map((t) => t.name).join(', ') || '(chưa có)'}`);

if (IN_KHOA) {
  for (const t of token) {
    const k = await goi(`/api/token/${t.id}/key`, { method: 'POST' });
    console.log(`${t.name}\tsk-${typeof k === 'string' ? k : k?.key}`);
  }
}
