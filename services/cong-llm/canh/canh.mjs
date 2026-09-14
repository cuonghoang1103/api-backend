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

// `keyThat`: id token → key THẬT (48 ký tự). Ghi xuống đĩa vì New API chặn
// dồn dập trên chính route lấy key — mất bộ nhớ tạm sau mỗi lần khởi động
// lại là 33 lượt gọi dồn một lúc, và bị chặn đúng lúc cần nhất.
let luu = { cuaSoDaDatLai: null, keyThat: {}, hanMucThem: {}, phien: null };
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
/**
 * Phiên đăng nhập New API.
 *
 * ⛔⛔ MỖI LẦN ĐĂNG NHẬP LÀ MỘT PHIÊN SỐNG MÃI. New API giữ trần
 * `USER_SESSION_ACTIVE_LIMIT` (mặc định 50) phiên còn hiệu lực cho một tài
 * khoản; chạm trần thì MỌI lần đăng nhập sau trả `409 AUTH_SESSION_LIMIT`.
 *
 * Bản cũ giữ JWT trong BIẾN NHỚ TẠM và không bao giờ đăng xuất, nên:
 *   · token hết hạn (~1 giờ) ⇒ đăng nhập lại ⇒ +1 phiên;
 *   · mỗi lần dựng lại container ⇒ mất JWT ⇒ đăng nhập lại ⇒ +1 phiên.
 * Đo thật 14/09/2026: 50 phiên active, cũ nhất từ 12/09 — tức ~1 phiên/giờ,
 * và đúng hai ngày là kẹt. Kẹt rồi thì chết dây chuyền: không nạp lại hạn mức
 * key con mỗi cửa sổ ⇒ key khách đã mua dùng hết một lần là chết hẳn.
 * Và nó chết ÂM THẦM — canh chỉ ghi một dòng WARN mỗi phút.
 *
 * Vá hai đầu:
 *  1. GIỮ phiên qua các lần khởi động (ghi vào `/state`), nên dựng lại
 *     container không còn đẻ thêm phiên;
 *  2. ĐĂNG XUẤT phiên cũ ngay trước khi tạo phiên mới, nên số phiên đứng yên
 *     ở 1 thay vì tăng mãi.
 */
let phien = null; // { jwt, userId, hetLuc }

/** Trả phiên đã lưu ở đĩa nếu còn hạn. */
function phienDaLuu() {
  const p = luu.phien;
  if (p?.jwt && Number(p.hetLuc) > Date.now() + 60_000) return p;
  return null;
}

/** Đăng xuất một phiên. Hỏng thì bỏ qua — đây là dọn dẹp, không phải việc chính. */
async function dangXuat(p) {
  if (!p?.jwt) return;
  try {
    await fetch(`${NEWAPI_URL}/api/user/logout`, {
      method: 'GET',
      headers: { authorization: `Bearer ${p.jwt}`, 'New-Api-User': String(p.userId ?? 1) },
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    /* phiên có thể đã chết sẵn — không sao */
  }
}

async function dangNhap() {
  if (phien && phien.hetLuc > Date.now() + 60_000) return phien;

  // Khởi động lại thì lấy lại phiên cũ thay vì đẻ phiên mới.
  const cu = phienDaLuu();
  if (cu) { phien = cu; return phien; }

  if (!NEWAPI_PASS) throw new Error('thiếu NEWAPI_PASS');

  // Trả chỗ TRƯỚC khi xin chỗ mới. Thiếu bước này là mỗi giờ rò một phiên.
  await dangXuat(luu.phien);

  const r = await fetch(`${NEWAPI_URL}/api/user/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: NEWAPI_USER, password: NEWAPI_PASS }),
    signal: AbortSignal.timeout(15_000),
  });
  const d = await r.json().catch(() => ({}));
  if (!d.success || !d.data?.access_token) {
    // Nói rõ MÃ lỗi: "Conflict" một mình không cho biết đang hết ngạch phiên.
    const ma = d.code ? ` (${d.code})` : '';
    throw new Error(`đăng nhập New API hỏng: ${d.message || r.status}${ma}`);
  }
  phien = {
    jwt: d.data.access_token,
    userId: d.data.user?.id ?? 1,
    hetLuc: (Number(d.data.access_expires_at) || 0) * 1000 || Date.now() + 10 * 60_000,
  };
  luu.phien = phien;
  luuTrangThai();
  return phien;
}

async function quanTri(duong, { method = 'GET', body, thuLai = true } = {}) {
  const p = await dangNhap();
  const r = await fetch(`${NEWAPI_URL}${duong}`, {
    method,
    headers: { authorization: `Bearer ${p.jwt}`, 'New-Api-User': String(p.userId), 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15_000),
  });
  // Phiên lưu ở đĩa có thể đã bị thu hồi phía New API (admin bấm tay, hoặc
  // dọn dẹp). Vứt nó đi và đăng nhập lại ĐÚNG MỘT lần, thay vì hỏng cho tới
  // khi có người dựng lại container.
  if ((r.status === 401 || r.status === 403) && thuLai) {
    phien = null;
    luu.phien = null;
    luuTrangThai();
    return quanTri(duong, { method, body, thuLai: false });
  }
  const d = await r.json().catch(() => ({}));
  if (!d.success) throw new Error(`${method} ${duong}: ${d.message || r.status}`);
  return d.data;
}

/**
 * Key THẬT của một token con.
 *
 * ⚠️ `GET /api/token/` trả `key` đã CHE: 18 ký tự, cùng 4 ký tự đầu với key
 * thật nhưng giữa bị thay. Key thật dài 48 ký tự và chỉ lấy được qua
 * `POST /api/token/:id/key`. Đo thật 14/09/2026 trên rc.37.
 *
 * Đây là loại lỗi không kêu một tiếng nào: `gopViVoiWeb` từng gửi
 * `sk-<18 ký tự che>` sang web, web không tìm thấy key nào khớp nên trả về
 * bản đồ rỗng, và canh `return` sớm — không lỗi, không log, ví chung không
 * bao giờ gộp. Nhìn từ ngoài y hệt "chưa ai dùng key".
 *
 * Nhớ theo id vì key của một token không đổi; 33 token thì chỉ tốn 33 lượt
 * gọi sau mỗi lần khởi động lại, thay vì 33 lượt MỖI PHÚT.
 */
async function layKeyThat(id) {
  const co = luu.keyThat?.[id];
  if (co) return co;
  const d = await quanTri(`/api/token/${id}/key`, { method: 'POST' });
  const k = typeof d === 'string' ? d : d?.key;
  if (typeof k !== 'string' || k.length < 32) return null;
  luu.keyThat = { ...(luu.keyThat || {}), [id]: k };
  luuTrangThai();
  return k;
}

/**
 * Hạn mức mỗi key con.
 *
 * Hai nguồn, gộp lại:
 *  1. `han-muc.json` — thứ người ta sửa tay rồi restart canh;
 *  2. `luu.hanMucThem` trong state — thứ do `POST /tao-key` ghi vào khi admin
 *     duyệt đơn trên web.
 *
 * ⚠️ Vì sao không ghi thẳng vào `han-muc.json`: thư mục `./canh` được gắn
 * READ-ONLY vào container (`- ./canh:/app:ro` trong docker-compose). Ghi vào
 * đó sẽ ném EROFS. Mà `/state` thì gắn ghi được và sống qua mọi lần dựng lại.
 *
 * Thiếu bước này thì key admin vừa cấp sẽ KHÔNG được `datLaiHanMuc()` nạp lại
 * ở cửa sổ kế tiếp — nó rơi về `mac_dinh_usd` (10 USD), tức người dùng được
 * cấp 60$ nhưng 5 giờ sau chỉ còn 10$. Im lặng, không lỗi.
 */
function docHanMuc() {
  const j = JSON.parse(readFileSync(HAN_MUC_FILE, 'utf8'));
  return {
    macDinh: Number(j.mac_dinh_usd),
    theoTen: { ...(j.theo_ten || {}), ...(luu.hanMucThem || {}) },
  };
}

/**
 * Tạo một key con mới ở New API. Dùng cho luồng "admin bấm Duyệt trên web".
 *
 * Trước 14/09/2026 admin phải: mở SSH tunnel → vào giao diện New API → tạo
 * token → đặt hạn mức → copy key → dán vào form duyệt. Năm bước tay cho mỗi
 * đơn, và nếu quên bước đặt hạn mức thì key chạy bằng mặc định mà không ai
 * thấy.
 *
 * ⚠️ Đặt hạn mức PHẢI ghi vào cả hai chỗ: `remain_quota` (số dùng được NGAY)
 * và bảng hạn mức (số nạp lại mỗi cửa sổ). Chỉ ghi cái đầu thì key chạy đúng
 * đúng một cửa sổ rồi tụt về mặc định.
 */
/**
 * KHOÁ một key con theo GIÁ TRỊ key (không phải theo id).
 *
 * Dùng cho hai việc: người dùng báo key bị lộ, và admin hoàn tiền một đơn.
 * Cả hai đều chỉ biết chuỗi key, không biết id trong New API.
 *
 * ⚠️ KHOÁ (`status = 2`) chứ không XOÁ. Xoá thì mất luôn số liệu đã tiêu, và
 * mất cả dấu vết để đối chiếu khi có tranh chấp "tôi có dùng đâu mà hết hạn
 * mức". Khoá thì key chết ngay lập tức mà lịch sử còn nguyên.
 *
 * ⚠️ So sánh bằng ĐUÔI key, vì `GET /api/token/` trả key ĐÃ CHE (18 ký tự,
 * xem `layKeyThat`). Lấy key thật của từng token để so là hàng chục lượt gọi
 * và dễ chạm trần ngạch; đuôi 8 ký tự đủ để không trùng trong vài chục key,
 * và ta CÒN kiểm cả tiền tố nữa.
 */
async function khoaKeyCon(keyDayDu) {
  const tho = String(keyDayDu || '').replace(/^sk-/, '');
  if (tho.length < 32) throw new Error('key không hợp lệ');

  const tatCa = [];
  for (let trang = 1; trang <= 20; trang++) {
    const d = await quanTri(`/api/token/?p=${trang}&page_size=100`);
    const items = d?.items || [];
    tatCa.push(...items);
    if (items.length < 100) break;
  }

  const dau = tho.slice(0, 4);
  const duoi = tho.slice(-4);
  const hop = tatCa.filter((t) => {
    const k = String(t.key || '');
    return k.startsWith(dau) && k.endsWith(duoi);
  });
  if (hop.length === 0) throw new Error('không tìm thấy key này trong New API');
  if (hop.length > 1) throw new Error(`có ${hop.length} key trùng dấu nhận dạng — không dám khoá, kiểm tay`);

  const t = hop[0];
  if (t.status !== 2) {
    await quanTri('/api/token/?status_only=true', { method: 'PUT', body: { id: t.id, status: 2 } });
  }
  // Quên hạn mức đã nhớ: key chết rồi thì `datLaiHanMuc` không cần nạp nữa.
  if (luu.hanMucThem?.[t.name] !== undefined) {
    const { [t.name]: _bo, ...conLai } = luu.hanMucThem;
    luu.hanMucThem = conLai;
    luuTrangThai();
  }
  return { id: t.id, ten: t.name };
}

async function taoKeyCon(ten, quotaUsd) {
  const usd = Number(quotaUsd);
  if (!ten || !/^[A-Za-z0-9_-]{3,60}$/.test(ten)) throw new Error('tên key không hợp lệ');
  if (!Number.isFinite(usd) || usd <= 0 || usd > 100_000) throw new Error('hạn mức không hợp lệ');

  const dsCu = await quanTri('/api/token/?p=1&page_size=100');
  if ((dsCu?.items || []).some((t) => t.name === ten)) throw new Error(`key tên "${ten}" đã tồn tại`);

  await quanTri('/api/token/', {
    method: 'POST',
    body: {
      name: ten,
      remain_quota: Math.round(usd * QUOTA_MOT_USD),
      unlimited_quota: false,
      expired_time: -1,
      model_limits_enabled: false,
      model_limits: '',
    },
  });

  // Nhớ hạn mức TRƯỚC khi trả key về: trả key xong mới ghi mà tiến trình chết
  // giữa chừng thì người dùng cầm một key không ai biết hạn mức của nó.
  luu.hanMucThem = { ...(luu.hanMucThem || {}), [ten]: usd };
  luuTrangThai();

  // New API trả key ĐÃ CHE trong danh sách — phải lấy key thật (xem layKeyThat).
  for (let trang = 1; trang <= 20; trang++) {
    const d = await quanTri(`/api/token/?p=${trang}&page_size=100`);
    const items = d?.items || [];
    const t = items.find((x) => x.name === ten);
    if (t) {
      const that = await layKeyThat(t.id);
      if (!that) throw new Error('tạo được key nhưng không lấy được giá trị thật');
      return { id: t.id, ten, quotaUsd: usd, key: `sk-${that}` };
    }
    if (items.length < 100) break;
  }
  throw new Error('tạo xong nhưng không tìm lại được key vừa tạo');
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

    // Key trong danh sách đã bị CHE (xem `layKeyThat`) — phải lấy key thật,
    // nếu không thì web không khớp được key nào và cả bước gộp thành vô hiệu.
    // Mỗi nhịp chỉ đi hỏi TỐI ĐA 5 key chưa biết. New API chặn dồn dập trên
    // route này; hỏi cả 33 cái một lúc là bị 429 và không lấy được cái nào.
    // Key đã biết thì đọc từ đĩa, nên sau vài phút là đủ cả.
    let conDuocHoi = 5;
    const thatCuaToken = new Map();
    for (const t of coQuota) {
      let k = luu.keyThat?.[t.id] || null;
      if (!k && conDuocHoi > 0) {
        conDuocHoi--;
        k = await layKeyThat(t.id).catch(() => null);
      }
      if (k) thatCuaToken.set(t.id, `sk-${k}`);
    }
    if (thatCuaToken.size === 0) { ghi('không lấy được key thật nào từ New API — bỏ lượt gộp ví'); return; }
    const day = [...thatCuaToken.values()];
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
      const khoaThat = thatCuaToken.get(t.id);
      const tin = khoaThat ? web[khoaThat] : null;
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

      // ⚠️⚠️ KEY MUA BẰNG TIỀN THẬT KHÔNG GỘP VÍ. Nó có hạn mức riêng, `canh`
      // nạp lại mỗi cửa sổ như mọi key con khác; cộng thêm phần đã tiêu ở AI
      // Code của app desktop là khoá oan key của người vừa trả tiền — và họ
      // mất đúng thứ họ mua. Chỉ key XIN theo quyền lợi Pro mới chung ví.
      // Web quyết định điều này (`gopVi`), canh không tự đoán theo tên key.
      //
      // Thiếu trường `gopVi` (backend cũ hơn) ⇒ coi như GỘP, giữ nguyên hành
      // vi trước đó thay vì âm thầm mở toang hạn mức cho mọi key.
      if (tin.gopVi === false) continue;

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
    // Web gọi vào đây khi admin bấm "Duyệt" ở đơn xin key. Khoá là
    // CANH_KHOA_NOI_BO — cùng khoá New API dùng để gọi canh, và cụm này chỉ
    // nghe trong mạng docker nội bộ, không ra Internet.
    if (req.method === 'POST' && req.url === '/tao-key') {
      const nhan = String(req.headers['x-khoa-noi-bo'] || '');
      if (!KHOA_NOI_BO || nhan !== KHOA_NOI_BO) {
        return traJson(res, 404, { loi: 'không có đường này' });
      }
      return docBody(req)
        // `docBody` trả BUFFER (nó vốn dùng để chuyển tiếp nguyên si sang
        // rambo), không phải object đã parse — quên chỗ này thì `b?.ten` là
        // undefined và lỗi hiện ra là "tên key không hợp lệ", chẳng nhắc gì
        // tới JSON.
        .then((buf) => {
          let b;
          try { b = JSON.parse(buf.toString('utf8') || '{}'); } catch { throw new Error('body không phải JSON'); }
          return taoKeyCon(b?.ten, b?.quotaUsd);
        })
        .then((kq) => {
          ghi(`đã tạo key con "${kq.ten}" (${kq.quotaUsd} USD/cửa sổ) theo yêu cầu của web`);
          traJson(res, 200, kq);
        })
        .catch((e) => {
          ghi('tạo key con hỏng:', e.message);
          if (!res.headersSent) traJson(res, 400, { loi: e.message });
        });
    }
    // Khoá một key con (người dùng báo lộ, hoặc admin hoàn tiền).
    if (req.method === 'POST' && req.url === '/khoa-key') {
      const nhan = String(req.headers['x-khoa-noi-bo'] || '');
      if (!KHOA_NOI_BO || nhan !== KHOA_NOI_BO) {
        return traJson(res, 404, { loi: 'không có đường này' });
      }
      return docBody(req)
        .then((buf) => {
          let b;
          try { b = JSON.parse(buf.toString('utf8') || '{}'); } catch { throw new Error('body không phải JSON'); }
          return khoaKeyCon(b?.key);
        })
        .then((kq) => {
          ghi(`đã KHOÁ key con "${kq.ten}" theo yêu cầu của web`);
          traJson(res, 200, kq);
        })
        .catch((e) => {
          ghi('khoá key con hỏng:', e.message);
          if (!res.headersSent) traJson(res, 400, { loi: e.message });
        });
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
