// ─── Canh cổng key con — lớp gác đứng giữa New API và rambo ─────────────
//
// Đường đi của một lượt gọi từ key con (OpenCode, web phụ…):
//
//   OpenCode ─ key con ─► nginx /llm/v1 ─► New API ─ khoá nội bộ ─► CANH ─ key chính ─► rambo
//
// cuongthai.com KHÔNG đi qua đây: backend gọi thẳng rambo bằng key chính như
// cũ, không trần, không chờ. Cả cửa sổ 5 giờ của gói max5 vẫn là của web.
//
// Canh làm bốn việc (việc thứ ba — nắn yêu cầu cho vừa giới hạn ngầm của
// rambo — nằm ở sua-yeu-cau.mjs; việc thứ tư — `GET /han-muc` cho người cầm
// key con tự kiểm — ở gần cuối file):
//
// 1. ƯU TIÊN WEB. Mỗi phút hỏi rambo key chính đã dùng bao nhiêu phần trăm
//    cửa sổ 5 giờ. Chạm NGUONG_NHUONG (mặc định 70%) thì mọi key con bị trả
//    429 cho tới khi tụt dưới NGUONG_MO_LAI (tức là tới lúc cửa sổ reset) —
//    phần cuối cửa sổ để dành trọn cho web. Hai ngưỡng khác nhau để cổng
//    không bật tắt liên tục quanh một con số.
//
// 2. ĐẶT LẠI HẠN MỨC KEY CON mỗi lần cửa sổ rambo reset. New API có hạn mức
//    theo key nhưng không tự nạp lại; thiếu bước này thì key con dùng hết
//    một lần là chết hẳn. Hạn mức từng key nằm ở `han-muc.json`.
//
// Key chính chỉ nằm trong tiến trình này. New API chỉ biết một khoá nội bộ
// để gọi vào canh — lộ DB của New API cũng không lộ key rambo.
//
// Không dùng thư viện nào: Node 22 có sẵn fetch và http.

import http from 'node:http';
import { readFileSync, writeFileSync, renameSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Readable } from 'node:stream';
import { nanYeuCau } from './sua-yeu-cau.mjs';

const env = process.env;

// Cùng tên biến với backend (`congAgent()` trong src/services/llm/gateway.ts),
// nên compose chỉ việc đọc lại /opt/cuonghoangdev/.env — không chép key.
const RAMBO_API = (env.AGENT_GATEWAY_BASE_URL || 'https://rambo.ai.vn/api/claude').trim().replace(/\/+$/, '');
const RAMBO_KEY = env.AGENT_GATEWAY_API_KEY?.trim();
// Trang "Kiểm tra key" của rambo gọi đúng endpoint này (đọc từ mã trang
// /auth/check-limit ngày 13/09/2026). Nó nằm ở gốc tên miền, không dưới /api/claude.
const RAMBO_CHECK = env.RAMBO_CHECK_URL || `${new URL(RAMBO_API).origin}/auth/check-limit/api/check`;

const KHOA_NOI_BO = env.CANH_KHOA_NOI_BO?.trim();
const NGUONG_NHUONG = Number(env.NGUONG_NHUONG ?? 0.7);
const NGUONG_MO_LAI = Number(env.NGUONG_MO_LAI ?? 0.6);
const CHU_KY_MS = Math.max(10_000, Number(env.CHU_KY_MS) || 60_000);
// Không đo được hạn mức lâu hơn mức này thì ĐÓNG cổng key con: không biết web
// còn bao nhiêu thì không được phép tiêu tiếp phần của web.
const MAT_TIN_HIEU_MS = Number(env.MAT_TIN_HIEU_MS) || 15 * 60_000;

const NEWAPI_URL = (env.NEWAPI_URL || 'http://cuonghoangdev_newapi:3000').replace(/\/+$/, '');
const NEWAPI_USER = env.NEWAPI_USER || 'quantri';
const NEWAPI_PASS = env.NEWAPI_PASS;

// ─── Nối với ví AI Code của web (14/09/2026) ────────────────────────────
// Người mua gói key terminal dùng CHUNG một hạn mức với AI Code trên app
// desktop. canh hỏi backend web "người này đã tiêu bao nhiêu ở app" rồi cộng
// với phần đã tiêu qua key, chạm trần thì KHOÁ key.
//
// Thiếu WEB_API_URL hoặc WEB_INTERNAL_TOKEN ⇒ bỏ hẳn bước này, canh chạy y
// như trước. Không chặn nhầm khi chưa cấu hình xong.
const WEB_API_URL = (env.WEB_API_URL || '').replace(/\/+$/, '');
const WEB_INTERNAL_TOKEN = env.WEB_INTERNAL_TOKEN || '';

const HAN_MUC_FILE = env.HAN_MUC_FILE || new URL('./han-muc.json', import.meta.url).pathname;
const STATE_FILE = env.STATE_FILE || '/state/canh.json';
const CONG = Number(env.CONG) || 8080;
// 950k token ngữ cảnh ≈ 4MB JSON. Chừa gấp 8 cho ảnh base64 trong lượt gọi.
const TRAN_BODY = 32 * 1024 * 1024;
// New API tính 500.000 quota = 1 USD (common.QuotaPerUnit).
const QUOTA_MOT_USD = 500_000;

function ghi(...a) {
  console.log(new Date().toISOString(), ...a);
}

if (!RAMBO_KEY || !KHOA_NOI_BO) {
  ghi('THIẾU AGENT_GATEWAY_API_KEY hoặc CANH_KHOA_NOI_BO — không khởi động.');
  process.exit(1);
}
if (!(NGUONG_MO_LAI < NGUONG_NHUONG)) {
  ghi(`NGUONG_MO_LAI (${NGUONG_MO_LAI}) phải NHỎ HƠN NGUONG_NHUONG (${NGUONG_NHUONG}) — không khởi động.`);
  process.exit(1);
}

// ─── Trạng thái ──────────────────────────────────────────────────────────
const s = {
  tiLe: null, // phần cửa sổ 5h key chính đã dùng, 0..1
  daDung: null,
  toiDa: null,
  hetCuaSoLuc: null, // mốc (ms) cửa sổ hiện tại hết hạn; null = rambo đang nghỉ
  lanDoCuoi: 0,
  loiDoCuoi: null,
  dangNhuong: true, // đóng cho tới lần đo đầu tiên
  lyDo: 'chưa đo hạn mức key chính lần nào',
  soLuot: 0,
  soLuotBiChan: 0,
};

let luu = { cuaSoDaDatLai: null };
try {
  luu = { ...luu, ...JSON.parse(readFileSync(STATE_FILE, 'utf8')) };
} catch {
  /* chạy lần đầu */
}
function luuTrangThai() {
  try {
    mkdirSync(dirname(STATE_FILE), { recursive: true });
    writeFileSync(`${STATE_FILE}.tmp`, JSON.stringify(luu));
    renameSync(`${STATE_FILE}.tmp`, STATE_FILE);
  } catch (e) {
    ghi('không ghi được', STATE_FILE, e.message);
  }
}

function phutConLai() {
  return s.hetCuaSoLuc ? Math.max(0, Math.round((s.hetCuaSoLuc - Date.now()) / 60_000)) : null;
}

function capNhatCong() {
  const truoc = s.dangNhuong;
  if (Date.now() - s.lanDoCuoi > MAT_TIN_HIEU_MS) {
    s.dangNhuong = true;
    s.lyDo = `không đo được hạn mức key chính từ ${s.lanDoCuoi ? new Date(s.lanDoCuoi).toISOString() : 'lúc khởi động'} (${s.loiDoCuoi || 'chưa có kết quả'})`;
  } else if (s.tiLe >= NGUONG_NHUONG) {
    s.dangNhuong = true;
    const ph = phutConLai();
    s.lyDo = `key chính đã dùng ${Math.round(s.tiLe * 100)}% cửa sổ 5h — phần còn lại nhường cho web${ph != null ? `, mở lại sau ~${ph} phút` : ''}`;
  } else if (s.tiLe < NGUONG_MO_LAI) {
    s.dangNhuong = false;
    s.lyDo = '';
  }
  // Ở giữa hai ngưỡng: giữ nguyên trạng thái cũ.
  if (truoc !== s.dangNhuong) ghi(s.dangNhuong ? `ĐÓNG key con: ${s.lyDo}` : `MỞ key con (key chính ${Math.round(s.tiLe * 100)}%)`);
}

// ─── Đo hạn mức key chính ────────────────────────────────────────────────
async function doHanMuc() {
  try {
    const r = await fetch(RAMBO_CHECK, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: RAMBO_KEY }),
      signal: AbortSignal.timeout(15_000),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`HTTP ${r.status} ${d.error || ''}`.trim());
    // Trang của rambo đọc đúng hai dòng này: `usage.usedTokens ?? usage.outputTokens`
    // và `quota.maxTokens` (vắng = không trần, hiển thị "∞").
    const daDung = Number(d.usage?.usedTokens ?? d.usage?.outputTokens ?? 0);
    const toiDa = Number(d.quota?.maxTokens) || 0;
    s.daDung = daDung;
    s.toiDa = toiDa || null;
    s.tiLe = toiDa > 0 ? daDung / toiDa : 0;
    const conMs = d.window?.remainingMs;
    s.hetCuaSoLuc = conMs == null ? null : Date.now() + Number(conMs);
    s.lanDoCuoi = Date.now();
    s.loiDoCuoi = null;
  } catch (e) {
    s.loiDoCuoi = e.message;
    ghi('đo hạn mức key chính hỏng:', e.message);
  }
  capNhatCong();
  if (s.lanDoCuoi && !s.loiDoCuoi && laCuaSoMoi()) await datLaiHanMuc();
  // Sau khi đã nạp lại (nếu là cửa sổ mới) mới gộp ví — ngược thứ tự thì ta
  // khoá key dựa trên quota của cửa sổ CŨ.
  await gopViVoiWeb();
}

// Mốc hết cửa sổ tính bằng "bây giờ + còn lại" nên nhích vài giây giữa hai
// lần đo. Lệch quá 10 phút mới là cửa sổ khác.
function laCuaSoMoi() {
  const cu = luu.cuaSoDaDatLai;
  if (s.hetCuaSoLuc == null) return cu !== 'nghi';
  if (typeof cu !== 'number') return true;
  return Math.abs(s.hetCuaSoLuc - cu) > 10 * 60_000;
}

// ─── Đặt lại hạn mức key con qua API quản trị của New API ────────────────
let phien = null; // { jwt, userId, hetLuc }

async function dangNhap() {
  if (phien && phien.hetLuc > Date.now() + 60_000) return phien;
  if (!NEWAPI_PASS) throw new Error('thiếu NEWAPI_PASS');
  const r = await fetch(`${NEWAPI_URL}/api/user/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: NEWAPI_USER, password: NEWAPI_PASS }),
    signal: AbortSignal.timeout(15_000),
  });
  const d = await r.json().catch(() => ({}));
  if (!d.success || !d.data?.access_token) throw new Error(`đăng nhập New API hỏng: ${d.message || r.status}`);
  phien = {
    jwt: d.data.access_token,
    userId: d.data.user?.id ?? 1,
    hetLuc: (Number(d.data.access_expires_at) || 0) * 1000 || Date.now() + 10 * 60_000,
  };
  return phien;
}

async function quanTri(duong, { method = 'GET', body } = {}) {
  const p = await dangNhap();
  const r = await fetch(`${NEWAPI_URL}${duong}`, {
    method,
    headers: { authorization: `Bearer ${p.jwt}`, 'New-Api-User': String(p.userId), 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15_000),
  });
  const d = await r.json().catch(() => ({}));
  if (!d.success) throw new Error(`${method} ${duong}: ${d.message || r.status}`);
  return d.data;
}

function docHanMuc() {
  const j = JSON.parse(readFileSync(HAN_MUC_FILE, 'utf8'));
  return { macDinh: Number(j.mac_dinh_usd), theoTen: j.theo_ten || {} };
}

/**
 * Cộng hai đường rồi khoá key đã tiêu hết phần chung.
 *
 * ⚠️ KHÔNG ghi đè `remain_quota`. New API TRỪ DẦN cột đó mỗi lượt gọi; ghi
 * đè nó mỗi phút là xoá mất phần terminal vừa dùng, và hai bên đánh nhau trên
 * cùng một con số. Thay vào đó chỉ bật/tắt `status` — thứ New API không tự sửa.
 *
 *   đã tiêu terminal = hạn mức nạp đầu cửa sổ − remain_quota hiện tại
 *   đã tiêu app      = hỏi backend web
 *   tổng ≥ hạn mức   ⇒ status = 2 (disabled)
 *   tổng < hạn mức   ⇒ mở lại nếu đang bị chính ta khoá
 *
 * Cửa sổ mới thì `datLaiHanMuc()` nạp lại quota và bật lại key như cũ.
 */
async function gopViVoiWeb() {
  if (!WEB_API_URL || !WEB_INTERNAL_TOKEN) return;
  try {
    const bang = docHanMuc();
    const tatCa = [];
    for (let trang = 1; trang <= 20; trang++) {
      const d = await quanTri(`/api/token/?p=${trang}&page_size=100`);
      const items = d?.items || [];
      tatCa.push(...items);
      if (items.length < 100) break;
    }
    const coQuota = tatCa.filter((t) => !t.unlimited_quota && t.key);
    if (coQuota.length === 0) return;

    // New API trả `key` không kèm tiền tố; backend lưu key ĐẦY ĐỦ ("sk-...").
    const day = coQuota.map((t) => `sk-${t.key}`);
    const r = await fetch(`${WEB_API_URL}/api/v1/internal/ai-code-usage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-internal-token': WEB_INTERNAL_TOKEN },
      body: JSON.stringify({ keys: day }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!r.ok) { ghi('hỏi ví AI Code của web hỏng:', r.status); return; }
    const j = await r.json().catch(() => null);
    const web = j?.data || {};
    if (Object.keys(web).length === 0) return;

    let khoa = 0;
    let mo = 0;
    let datHan = 0;
    for (const t of coQuota) {
      const tin = web[`sk-${t.key}`];
      if (!tin) continue;

      // ── Hạn của GÓI (key bán ở shop) ──────────────────────────────────
      // Web là nơi duy nhất biết gói bán ngày nào, hạn bao lâu. New API là
      // nơi duy nhất CHẶN được key khi hết hạn. Chép hạn sang một lần, rồi
      // để New API tự từ chối — canh không phải nhớ gì thêm.
      // `expired_time` của New API tính bằng GIÂY epoch; -1 = không hạn.
      const hetHan = tin.hetHanLuc == null ? -1 : Number(tin.hetHanLuc);
      if (Number.isFinite(hetHan) && Number(t.expired_time ?? -1) !== hetHan) {
        await quanTri('/api/token/', { method: 'PUT', body: { ...t, expired_time: hetHan } });
        datHan++;
        t.expired_time = hetHan;
      }
      // Hết hạn rồi thì thôi không tính ví nữa — New API tự chặn key.
      if (hetHan > 0 && hetHan * 1000 <= Date.now()) continue;

      const hanMuc = Number(tin.tranUsd ?? (t.name in bang.theoTen ? bang.theoTen[t.name] : bang.macDinh));
      if (!Number.isFinite(hanMuc) || hanMuc <= 0) continue;

      const conLaiUsd = Number(t.remain_quota || 0) / QUOTA_MOT_USD;
      const terminalUsd = Math.max(0, hanMuc - conLaiUsd);
      const tong = terminalUsd + Number(tin.daTieuUsd || 0);

      if (tong >= hanMuc && t.status === 1) {
        await quanTri('/api/token/?status_only=true', { method: 'PUT', body: { id: t.id, status: 2 } });
        khoa++;
      } else if (tong < hanMuc && t.status === 2) {
        // Chỉ mở lại key mà CHÍNH TA đã khoá vì cạn ví. Key admin khoá tay
        // trong giao diện cũng mang status 2 — không phân biệt được, nên chỉ
        // mở khi ví đã thật sự còn chỗ, và ghi log để còn lần theo.
        await quanTri('/api/token/?status_only=true', { method: 'PUT', body: { id: t.id, status: 1 } });
        mo++;
      }
    }
    if (khoa || mo || datHan) ghi(`gộp ví AI Code: khoá ${khoa} key cạn hạn mức, mở lại ${mo}, đặt hạn gói cho ${datHan}`);
  } catch (e) {
    // Hỏng thì thôi — nhịp sau thử lại. Không được để một lỗi đo làm chết canh.
    ghi('gộp ví AI Code hỏng (sẽ thử lại nhịp sau):', e.message);
  }
}

let dangDatLai = false;

async function datLaiHanMuc() {
  if (dangDatLai) return;
  dangDatLai = true;
  try {
    const bang = docHanMuc();
    const tatCa = [];
    for (let trang = 1; trang <= 20; trang++) {
      const d = await quanTri(`/api/token/?p=${trang}&page_size=100`);
      const items = d?.items || [];
      tatCa.push(...items);
      if (items.length < 100) break;
    }
    let soKey = 0;
    for (const t of tatCa) {
      // Key "không giới hạn" là key quản lý TAY trong giao diện — không đụng.
      if (t.unlimited_quota) continue;
      // Gói đã hết hạn thì KHÔNG nạp lại — nạp là tặng thêm một cửa sổ cho
      // người đã hết hạn dùng, mỗi 5 giờ một lần, mãi mãi.
      const hetHan = Number(t.expired_time ?? -1);
      if (hetHan > 0 && hetHan * 1000 <= Date.now()) continue;
      const usd = Number(t.name in bang.theoTen ? bang.theoTen[t.name] : bang.macDinh);
      if (!Number.isFinite(usd) || usd < 0) continue;
      await quanTri('/api/token/', { method: 'PUT', body: { ...t, remain_quota: Math.round(usd * QUOTA_MOT_USD) } });
      // Hết hạn mức thì New API tự chuyển key sang trạng thái 4 (exhausted);
      // nạp lại quota không tự bật lại, phải bật riêng.
      if (t.status === 4) await quanTri('/api/token/?status_only=true', { method: 'PUT', body: { id: t.id, status: 1 } });
      soKey++;
    }
    luu.cuaSoDaDatLai = s.hetCuaSoLuc ?? 'nghi';
    luuTrangThai();
    ghi(`cửa sổ mới → đã nạp lại hạn mức cho ${soKey} key con`);
  } catch (e) {
    // Không đánh dấu đã nạp ⇒ lần đo sau tự thử lại.
    ghi('nạp lại hạn mức key con hỏng (sẽ thử lại lần đo sau):', e.message);
  } finally {
    dangDatLai = false;
  }
}

// ─── Chuyển tiếp lượt gọi từ New API sang rambo ─────────────────────────
function loiAnthropic(res, status, type, message) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ type: 'error', error: { type, message } }));
}

function docBody(req) {
  return new Promise((ok, hong) => {
    const khuc = [];
    let tong = 0;
    req.on('data', (c) => {
      tong += c.length;
      if (tong > TRAN_BODY) {
        hong(Object.assign(new Error('quá lớn'), { quaLon: true }));
        req.destroy();
      } else khuc.push(c);
    });
    req.on('end', () => ok(Buffer.concat(khuc)));
    req.on('error', hong);
  });
}

const HEADER_CHUYEN = ['content-type', 'anthropic-version', 'anthropic-beta', 'accept'];

async function chuyenTiep(req, res) {
  const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (req.headers['x-api-key'] !== KHOA_NOI_BO && bearer !== KHOA_NOI_BO) {
    return loiAnthropic(res, 401, 'authentication_error', 'sai khoá nội bộ');
  }
  s.soLuot++;
  if (s.dangNhuong) {
    s.soLuotBiChan++;
    // CỐ Ý không gửi `retry-after`. OpenCode tôn trọng nó tới từng giây: đo
    // thật với retry-after 3600 thì `opencode run` đứng im cả tiếng, không in
    // gì. Không có header thì nó thử lại 5 lần theo cấp số (~1 phút) rồi hiện
    // đúng câu dưới đây — người dùng biết vì sao và biết lúc nào mở lại.
    return loiAnthropic(res, 429, 'rate_limit_error', `Cổng key con đang tạm đóng: ${s.lyDo}.`);
  }

  let body;
  try {
    body = await docBody(req);
  } catch (e) {
    return loiAnthropic(res, e.quaLon ? 413 : 400, 'invalid_request_error', e.quaLon ? 'yêu cầu vượt 32MB' : 'không đọc được yêu cầu');
  }

  const headers = { 'x-api-key': RAMBO_KEY };
  for (const h of HEADER_CHUYEN) if (req.headers[h]) headers[h] = req.headers[h];

  const ac = new AbortController();
  res.on('close', () => {
    if (!res.writableEnded) ac.abort();
  });

  const batDau = Date.now();
  let model = '?';
  let ghiChu = '';
  try {
    const j = JSON.parse(body.toString('utf8'));
    model = j.model || '?';
    // Rambo cắt ngầm khối >~12k ký tự và bỏ tin nhắn cũ quá ~58 — xem sua-yeu-cau.mjs.
    const nan = nanYeuCau(j);
    if (nan.ghiChu) {
      body = Buffer.from(JSON.stringify(nan.body));
      ghiChu = ` · ${nan.ghiChu}`;
    }
  } catch {
    /* body không phải JSON — chuyển nguyên, để rambo tự trả lỗi */
  }

  let r;
  try {
    r = await fetch(`${RAMBO_API}${req.url}`, { method: 'POST', headers, body, signal: ac.signal });
  } catch (e) {
    if (ac.signal.aborted) return;
    ghi('rambo không trả lời:', e.message);
    return loiAnthropic(res, 502, 'api_error', `không nối được tới rambo: ${e.message}`);
  }

  const traVe = { 'content-type': r.headers.get('content-type') || 'application/json', 'cache-control': 'no-cache' };
  const ra = r.headers.get('retry-after');
  if (ra) traVe['retry-after'] = ra;
  res.writeHead(r.status, traVe);
  if (r.status === 401 || r.status === 403) ghi(`⚠️ rambo từ chối KEY CHÍNH (HTTP ${r.status}) — cả web cũng đang hỏng`);

  if (!r.body) return res.end();
  const luong = Readable.fromWeb(r.body);
  luong.on('error', () => res.destroy());
  luong.on('end', () => ghi(`${model} ${r.status} ${Date.now() - batDau}ms ${Math.round(body.length / 1024)}KB${ghiChu}`));
  luong.pipe(res);
}

// ─── Kiểm hạn mức cho NGƯỜI CẦM KEY CON ─────────────────────────────────
//
//   curl -s https://api.cuongthai.com/llm/han-muc -H "Authorization: Bearer $CUONG_LLM_KEY"
//
// Gộp hai thứ mà người dùng OpenCode cần mà không nơi nào khác cho xem cùng lúc:
// key con còn bao nhiêu trong cửa sổ này (New API biết), và cổng có đang đóng
// vì web đã dùng gần hết key chính không (chỉ canh biết). Thiếu vế sau thì một
// key còn 9 USD vẫn nhận 429, và người dùng không có cách nào hiểu vì sao.
//
// Xác thực bằng chính key con: New API `GET /api/usage/token/` chạy TokenAuth.
// Đo thật trên New API rc.37 (13/09/2026):
//   • PHẢI có dấu `/` cuối — thiếu thì 301 sang trang HTML, không phải JSON
//   • trả `name`, `total_available` (= remain_quota), `total_used` (= used_quota
//     CỘNG DỒN từ lúc tạo key, KHÔNG theo cửa sổ), đơn vị 500.000 = 1 USD
// Vì `total_used` cộng dồn, số đã dùng TRONG CỬA SỔ NÀY = hạn mức của key
// (`han-muc.json`, đúng số canh nạp lúc reset) − số còn lại.
function traJson(res, status, d) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(`${JSON.stringify(d, null, 2)}\n`);
}

function usd(quota) {
  return Math.round((Number(quota) / QUOTA_MOT_USD) * 100) / 100;
}

function gioPhut(phut) {
  if (phut == null) return null;
  const g = Math.floor(phut / 60);
  return g ? `${g} giờ ${phut % 60} phút` : `${phut} phút`;
}

function trangThaiCong() {
  const ph = phutConLai();
  return {
    dangMo: !s.dangNhuong,
    lyDo: s.dangNhuong ? s.lyDo : '',
    keyChinhDaDung: s.tiLe == null ? null : `${Math.round(s.tiLe * 100)}%`,
    dongKhiKeyChinhToi: `${Math.round(NGUONG_NHUONG * 100)}%`,
    cuaSoResetSau: gioPhut(ph),
    resetLuc: s.hetCuaSoLuc
      ? new Date(s.hetCuaSoLuc).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
      : null,
  };
}

async function hanMucKey(req, res) {
  const key = String(req.headers['x-api-key'] || (req.headers.authorization || '').replace(/^Bearer\s+/i, '')).trim();
  if (!key) {
    return traJson(res, 401, { loi: 'Thiếu key con. Gửi kèm header: Authorization: Bearer $CUONG_LLM_KEY' });
  }
  let d;
  try {
    const r = await fetch(`${NEWAPI_URL}/api/usage/token/`, {
      headers: { authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(10_000),
    });
    d = await r.json().catch(() => ({}));
  } catch (e) {
    return traJson(res, 502, { loi: `Không hỏi được New API: ${e.message}`, cong: trangThaiCong() });
  }
  if (d?.code !== true || !d.data) {
    // Câu của New API có thể kèm key bị che một phần — không trả nguyên văn.
    return traJson(res, 401, { loi: 'Key con không hợp lệ, đã bị xoá, hoặc đang bị khoá trong New API.' });
  }
  const t = d.data;
  const cuaSoNay = t.unlimited_quota
    ? { khongGioiHan: true }
    : (() => {
        let hanMucUsd = null;
        try {
          const bang = docHanMuc();
          hanMucUsd = Number(t.name in bang.theoTen ? bang.theoTen[t.name] : bang.macDinh);
        } catch {
          /* thiếu han-muc.json: vẫn trả được số còn lại */
        }
        // Có thể ÂM: New API cho lượt cuối đi trọn rồi mới trừ theo số token
        // thật (đo: còn 1,00 USD, một lượt 2,25 USD vẫn qua ⇒ còn −1,25).
        const conLaiThat = usd(t.total_available);
        const daDungUsd = hanMucUsd == null ? null : Math.max(0, Math.round((hanMucUsd - conLaiThat) * 100) / 100);
        return {
          hanMucUsd,
          daDungUsd,
          conLaiUsd: Math.max(0, conLaiThat),
          ...(conLaiThat < 0 ? { vuotUsd: -conLaiThat } : {}),
          daDung: hanMucUsd ? `${Math.min(100, Math.round((daDungUsd / hanMucUsd) * 100))}%` : null,
          hetHanMuc: Number(t.total_available) <= 0,
        };
      })();
  const cong = trangThaiCong();
  const dung = cuaSoNay.hetHanMuc
    ? `Key đã hết hạn mức cửa sổ này — tự nạp lại khi cửa sổ reset${cong.cuaSoResetSau ? ` (sau ~${cong.cuaSoResetSau})` : ''}.`
    : !cong.dangMo
      ? `Cổng đang đóng: ${cong.lyDo}.`
      : 'Dùng được.';
  return traJson(res, 200, {
    key: t.name,
    ketLuan: dung,
    cuaSoNay,
    cong,
    ghiChu: 'USD là số QUY ĐỔI theo giá Anthropic để chia phần, không phải tiền thật. Hạn mức nạp lại mỗi lần cửa sổ 5 giờ của key chính reset.',
  });
}

// ─── Máy chủ ─────────────────────────────────────────────────────────────
http
  .createServer((req, res) => {
    if (req.method === 'GET' && (req.url === '/han-muc' || req.url.startsWith('/han-muc?'))) {
      return hanMucKey(req, res).catch((e) => {
        ghi('lỗi kiểm hạn mức:', e.message);
        if (!res.headersSent) traJson(res, 500, { loi: 'lỗi nội bộ của canh' });
      });
    }
    if (req.method === 'GET' && req.url === '/suc-khoe') {
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(
        JSON.stringify({
          dangNhuong: s.dangNhuong,
          lyDo: s.lyDo,
          keyChinhDaDung: s.tiLe == null ? null : `${Math.round(s.tiLe * 100)}%`,
          daDung: s.daDung,
          toiDa: s.toiDa,
          phutConLaiCuaSo: phutConLai(),
          nguong: { nhuong: NGUONG_NHUONG, moLai: NGUONG_MO_LAI },
          lanDoCuoi: s.lanDoCuoi ? new Date(s.lanDoCuoi).toISOString() : null,
          loiDoCuoi: s.loiDoCuoi,
          soLuot: s.soLuot,
          soLuotBiChan: s.soLuotBiChan,
        }),
      );
    }
    if (req.method === 'POST' && req.url.startsWith('/v1/')) {
      return chuyenTiep(req, res).catch((e) => {
        ghi('lỗi chuyển tiếp:', e.message);
        if (!res.headersSent) loiAnthropic(res, 500, 'api_error', 'lỗi nội bộ của canh');
        else res.destroy();
      });
    }
    loiAnthropic(res, 404, 'not_found_error', 'không có đường này');
  })
  .listen(CONG, () => {
    ghi(`canh nghe :${CONG} → ${RAMBO_API} · nhường khi ≥${NGUONG_NHUONG * 100}% · mở lại khi <${NGUONG_MO_LAI * 100}%`);
    doHanMuc();
    setInterval(doHanMuc, CHU_KY_MS);
  });
