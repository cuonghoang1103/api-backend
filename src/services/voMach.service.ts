/**
 * Vở viết tay (iPad) — "Vẽ giúp → ⚡ Mạch điện" (sơ đồ NỐI DÂY).
 * ─────────────────────────────────────────────────────────────────────
 * "Nối mic INMP441 vào ESP32: SCK → GPIO 4, WS → GPIO 5…" → một sơ đồ ghi
 * đúng TỪNG CHÂN, dây có màu, chân để hở có dấu X, cảnh báo ở cuối.
 *
 * Vì sao không đi đường SVG của `ve_net`: đo thật 01/10/2026 với đề nối mic +
 * loa cho robot, chế độ "Sơ đồ học tập" vẽ ra một con ESP32 trơ trọi, chân
 * ghi "4 5 5 7 15 15" thay vì "4 5 6 7 15 16", nhãn ①–⑩ không tên. Hai nguyên
 * nhân gốc: đề bị cắt còn 300 ký tự (AI chưa từng đọc tới mic, ampli, loa),
 * và chế độ đó CẤM `<text>` nên model tự "vẽ" chữ số bằng nét. Với sơ đồ nối
 * dây, sai một chữ số là cắm sai một sợi.
 *
 * Nên chia việc y như `voSoDo`: model chỉ TÁCH CẤU TRÚC — module, chân, dây,
 * màu, chân để hở, linh kiện, cảnh báo — và CHÉP NGUYÊN VĂN chữ/số từ đề.
 * App (`SoDoMach.swift`) tự dàn kiểu bậc thang: module bên trái, bo chính bên
 * phải, mỗi dây một hàng ngang nên không bao giờ cắt nhau; chữ viết bằng
 * phông nét đơn.
 *
 * ⚠️ Chữ đi ra phải nằm trong bảng ký tự phông nét đơn của app (Latin + tiếng
 * Việt + số + dấu câu ASCII) — `sachChu` đổi µ → u, Ω → ohm, ⌀ → phi…
 */
import crypto from 'node:crypto';
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';
import { AppError, BadRequestError } from '../middleware/errorHandler.js';
import { tachJson } from './voVietLai.service.js';
import { sachNhan } from './voSoDo.service.js';

export const LOAI_KHOI = ['mcu', 'module', 'cam_bien', 'man_hinh', 'loa', 'dong_co', 'pin', 'nguon', 'led', 'nut', 'cong_tac'] as const;
export const LOAI_LINH_KIEN = ['tu', 'tu_hoa', 'dien_tro', 'diode', 'led', 'cau_chi', 'nut', 'cong_tac', 'cuon_cam'] as const;
type LoaiKhoi = (typeof LOAI_KHOI)[number];
type LoaiLinhKien = (typeof LOAI_LINH_KIEN)[number];

export type ChanRef = { khoi: string; chan: string };
export interface MachDien {
  tieuDe: string;
  /** id của bo chính (thường là vi điều khiển) — app đặt nó ở cột phải. */
  chinh: string;
  khoi: { id: string; ten: string; phu?: string; loai: LoaiKhoi; chan: string[] }[];
  /** `toi` luôn là đầu phía bo chính khi một đầu nằm ở bo chính. */
  day: { tu: ChanRef; toi: ChanRef; mau: string; tenMau: string; nhan?: string }[];
  deHo: (ChanRef & { nhan?: string })[];
  linhKien: { loai: LoaiLinhKien; giaTri?: string; a: ChanRef; b: ChanRef; nhan?: string }[];
  ghiChuChan: (ChanRef & { nhan: string })[];
  canhBao: string[];
}

/** Trần độ dài đề. Quá thì BÁO, không cắt im lặng — cắt im lặng là lỗi 01/10. */
export const DE_TOI_DA = 4000;

const SYSTEM = [
  'Bạn là kỹ sư điện tử vẽ sơ đồ NỐI DÂY cho người mới lắp mạch (Arduino, ESP32, Raspberry Pi, module cảm biến, ampli, động cơ, nguồn…).',
  'Từ mô tả, tách CẤU TRÚC sơ đồ. Trả về DUY NHẤT một đối tượng JSON, không giải thích, đúng dạng:',
  '{"tieuDe":"Nối mic INMP441","chinh":"esp","khoi":[{"id":"esp","ten":"ESP32-S3","phu":"trên shield MKE-B01","loai":"mcu","chan":["GPIO 4","GPIO 5","3V3","GND"]},{"id":"mic","ten":"INMP441","phu":"micro","loai":"cam_bien","chan":["SCK","WS","L/R","SD","VDD","GND"]}],'
    + '"day":[{"tu":{"khoi":"mic","chan":"SCK"},"toi":{"khoi":"esp","chan":"GPIO 4"},"mau":"vàng"},{"tu":{"khoi":"mic","chan":"L/R"},"toi":{"khoi":"mic","chan":"GND"},"nhan":"BẮT BUỘC"}],'
    + '"deHo":[{"khoi":"amp","chan":"SD","nhan":"nối GND là loa câm"}],'
    + '"linhKien":[{"loai":"tu_hoa","giaTri":"1000uF","a":{"khoi":"amp","chan":"Vin"},"b":{"khoi":"amp","chan":"GND"},"nhan":"nên có"}],'
    + '"ghiChuChan":[{"khoi":"esp","chan":"3V3","nhan":"khối 3V3 của shield"}],"canhBao":["Mic chỉ dùng 3V3. Cấp 5V là chết mic."]}',
  'Quy tắc:',
  '- CHÉP NGUYÊN VĂN mọi tên chân, số GPIO, giá trị linh kiện, màu dây có trong mô tả. Tuyệt đối không đổi số, không bịa chân, không gộp hai chân làm một, không bỏ sót sợi nào. Mô tả ghi "GPIO 15" thì ghi "GPIO 15".',
  '- "khoi": mỗi bo / module / thiết bị là một khối. "id" ngắn, không dấu, duy nhất (CHỈ "id" là không dấu). "ten" là tên in trên bo hoặc mã linh kiện (ESP32-S3, INMP441, MAX98357A, L298N…). "phu" là mô tả rất ngắn bằng tiếng Việt CÓ DẤU đầy đủ (micro, ampli, động cơ trái, loa phi 65…). "chan" là các chân CÓ LIÊN QUAN, tên NGẮN đúng chữ in trên bo (≤ 12 ký tự: "GPIO 4", "OUT1", "+", "-"). Giải thích thêm về một chân (chân dài, cực dương, lấy ở khối nào…) thì đưa vào "ghiChuChan", KHÔNG nhét vào tên chân.',
  '- "loai" của khối: "mcu" (bo vi điều khiển chính) · "cam_bien" · "man_hinh" · "loa" · "dong_co" · "pin" (pin, ắc quy) · "nguon" (mạch hạ áp, adapter, BMS) · "led" · "nut" (nút nhấn) · "cong_tac" · "module" (còn lại).',
  '- "chinh": id của bo VI ĐIỀU KHIỂN (khối "mcu"), kể cả khi một module khác nhiều dây hơn. Chỉ khi không có vi điều khiển mới chọn bo có nhiều dây nhất.',
  '- "day": mỗi sợi dây là MỘT phần tử. "tu" là đầu phía module, "toi" là đầu phía bo chính. Dây nối hai chân trên CÙNG một module (vd L/R sang GND ngay trên bo mic) thì "tu" và "toi" cùng "khoi". Dây giữa hai module (vd ampli sang loa) ghi bình thường. "mau" chỉ ghi khi mô tả có nói màu dây — không nói thì BỎ TRỐNG, app tự tô. "nhan" là ghi chú rất ngắn (≤ 6 chữ) nếu mô tả có.',
  '- "deHo": các chân mô tả bảo ĐỂ HỞ / không nối, kèm lý do ngắn nếu có.',
  '- "linhKien": linh kiện rời nằm giữa hai chân: "tu" (tụ gốm), "tu_hoa" (tụ hoá — "a" là chân dương), "dien_tro", "diode" ("a" là anot), "led" ("a" là chân dương), "cau_chi", "nut", "cong_tac", "cuon_cam". Linh kiện nằm TRÊN một sợi dây (vd điện trở 220 ohm giữa GPIO 2 và chân dương LED) thì "a", "b" là hai đầu của sợi dây đó, và KHÔNG ghi sợi đó vào "day" nữa.',
  '- "ghiChuChan": ghi chú gắn vào một chân cụ thể (vd 3V3 lấy ở khối 3V3 của shield; 5V lấy ở hàng 5V).',
  '- "canhBao": tối đa 8 câu cảnh báo QUAN TRỌNG có trong mô tả (nguồn 3V3 hay 5V, chân nào không được nối GND, cực tính tụ…). Mỗi câu ≤ 22 chữ, giữ nguyên số liệu.',
  '- Chữ tiếng Việt có dấu. KHÔNG dùng emoji hay ký tự đặc biệt: viết "uF" thay µF, "ohm" thay Ω, "->" thay mũi tên, "phi" thay ⌀.',
  '- Tối đa 10 khối, 40 dây.',
].join('\n');

// ── Màu dây ────────────────────────────────────────────────────────────

/**
 * Bảng màu dây. Đậm hơn màu "chuẩn" một chút có chủ đích: vàng tươi trên
 * giấy trắng gần như không thấy, và dây trắng thật thì vẽ bằng xám nhạt.
 */
export const MAU = {
  do: { ten: 'đỏ', hex: '#DC2626' },
  cam: { ten: 'cam', hex: '#EA580C' },
  vang: { ten: 'vàng', hex: '#C99A06' },
  luc: { ten: 'lục', hex: '#16A34A' },
  lam: { ten: 'lam', hex: '#2563EB' },
  tim: { ten: 'tím', hex: '#7C3AED' },
  nau: { ten: 'nâu', hex: '#92400E' },
  xam: { ten: 'xám', hex: '#6B7280' },
  den: { ten: 'đen', hex: '#111827' },
  trang: { ten: 'trắng', hex: '#A8AEB8' },
  hong: { ten: 'hồng', hex: '#DB2777' },
  ngoc: { ten: 'xanh ngọc', hex: '#0D9488' },
} as const;
type MaMau = keyof typeof MAU;

/** Màu dành cho tín hiệu khi đề không nói màu. Đỏ/cam/đen để dành cho nguồn. */
const VONG_TIN_HIEU: MaMau[] = ['vang', 'luc', 'lam', 'tim', 'nau', 'xam', 'hong', 'ngoc'];

const boDau = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();

/** Tên màu (Việt hoặc Anh, có dấu hay không) → mã màu. `null` = không nhận ra. */
export function maMau(v: unknown): MaMau | null {
  const s = boDau(String(v ?? '')).replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!s) return null;
  // Thứ tự quan trọng: "xanh ngọc" và "xanh lá" phải bắt trước "xanh" trơn.
  const bang: [RegExp, MaMau][] = [
    [/\b(xanh ngoc|ngoc|cyan|teal|aqua)\b/, 'ngoc'],
    [/\b(xanh la|luc|green)\b/, 'luc'],
    [/\b(xanh duong|xanh lam|xanh nuoc bien|lam|blue)\b/, 'lam'],
    [/\b(do|red)\b/, 'do'],
    [/\b(cam|orange)\b/, 'cam'],
    [/\b(vang|yellow)\b/, 'vang'],
    [/\b(tim|purple|violet)\b/, 'tim'],
    [/\b(nau|brown)\b/, 'nau'],
    [/\b(xam|ghi|gray|grey)\b/, 'xam'],
    [/\b(den|black)\b/, 'den'],
    [/\b(trang|white)\b/, 'trang'],
    [/\b(hong|pink)\b/, 'hong'],
    [/^xanh$/, 'lam'],
  ];
  for (const [re, ma] of bang) if (re.test(s)) return ma;
  return null;
}

/** Màu mặc định theo TÊN CHÂN nguồn. Chân tín hiệu → `null` (đi vòng màu). */
export function mauTheoChan(ten: string): MaMau | null {
  const s = ten.toUpperCase().replace(/\s+/g, '');
  if (/GND/.test(s) || /^(G|VSS|0V|AGND|DGND|COM)$/.test(s)) return 'den';
  if (/^(\+?5V0?|VIN|VBUS|5VDC)$/.test(s)) return 'cam';
  if (/^(\+?3V3|\+?3[.,]3V|VCC|VDD|\+?12V|VBAT|BAT\+|B\+|V\+)$/.test(s)) return 'do';
  return null;
}

// ── Dọn chữ ────────────────────────────────────────────────────────────

/** Chữ ngoài phông nét đơn của app thì đổi sang dạng viết được rồi mới lọc. */
export function sachChu(s: unknown, dai: number): string {
  const t = String(s ?? '')
    .replace(/[①-⑳]/g, (c) => String(c.charCodeAt(0) - 0x245f))   // ①..⑳ → 1..20
    .replace(/[µμ]/g, 'u').replace(/Ω/g, 'ohm').replace(/[⌀ØøΦφ]/g, 'phi ')
    .replace(/±/g, '+/-').replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/≈/g, '~')
    .replace(/°/g, ' do').replace(/[·•∙]/g, '-').replace(/²/g, '2').replace(/³/g, '3');
  return sachNhan(t, dai);
}

const idSach = (v: unknown) => boDau(String(v ?? '')).replace(/[^a-z0-9_]/g, '').slice(0, 24);
/** Khoá so khớp tên chân: "GPIO 4" ≡ "gpio4" ≡ "GPIO_4". Giữ "+", "-", "/". */
const khoaChan = (s: string) => boDau(s).toUpperCase().replace(/[\s_]+/g, '');

// ── Kiểm + dọn cấu trúc model trả ──────────────────────────────────────

/** `null` nếu không dựng được sơ đồ nào (không có khối hoặc không có dây). */
export function donMach(o: Record<string, unknown> | null, de: string): MachDien | null {
  if (!o) return null;
  type Khoi = MachDien['khoi'][number];
  const khoi: Khoi[] = [];
  for (const x of Array.isArray(o.khoi) ? o.khoi : []) {
    const k = (x ?? {}) as Record<string, unknown>;
    const ten = sachChu(k.ten, 28);
    const id = idSach(k.id) || idSach(ten);
    if (!id || khoi.some((n) => n.id === id)) continue;
    const loai = (LOAI_KHOI as readonly string[]).includes(String(k.loai)) ? (k.loai as LoaiKhoi) : 'module';
    const chan: string[] = [];
    for (const c of Array.isArray(k.chan) ? k.chan : []) {
      const t = sachChu(c, 20);
      if (t && !chan.some((d) => khoaChan(d) === khoaChan(t))) chan.push(t);
      if (chan.length >= 30) break;
    }
    const phu = sachChu(k.phu, 40);
    khoi.push({ id, ten: ten || id, ...(phu ? { phu } : {}), loai, chan });
    if (khoi.length >= 10) break;
  }
  if (khoi.length < 2) return null;

  /** Tìm (hoặc thêm) chân được nhắc tới. Model hay dùng chân trong dây mà quên liệt kê ở khối. */
  const timChan = (v: unknown): ChanRef | null => {
    const r = (v ?? {}) as Record<string, unknown>;
    const id = idSach(r.khoi);
    const k = khoi.find((n) => n.id === id)
      ?? khoi.find((n) => idSach(n.ten) === id && id !== '');
    const ten = sachChu(r.chan, 20);
    if (!k || !ten) return null;
    const co = k.chan.find((c) => khoaChan(c) === khoaChan(ten));
    if (co) return { khoi: k.id, chan: co };
    if (k.chan.length >= 30) return null;
    k.chan.push(ten);
    return { khoi: k.id, chan: ten };
  };
  const trung = (a: ChanRef, b: ChanRef) => a.khoi === b.khoi && a.chan === b.chan;

  // Dây — chưa tô màu, chưa định hướng (còn phải biết bo chính là ai).
  type DayTho = { tu: ChanRef; toi: ChanRef; mau: MaMau | null; nhan?: string };
  const dayTho: DayTho[] = [];
  for (const x of Array.isArray(o.day) ? o.day : []) {
    const d = (x ?? {}) as Record<string, unknown>;
    const tu = timChan(d.tu), toi = timChan(d.toi);
    if (!tu || !toi || trung(tu, toi)) continue;
    if (dayTho.some((e) => (trung(e.tu, tu) && trung(e.toi, toi)) || (trung(e.tu, toi) && trung(e.toi, tu)))) continue;
    const nhan = sachChu(d.nhan, 48);
    dayTho.push({ tu, toi, mau: maMau(d.mau), ...(nhan ? { nhan } : {}) });
    if (dayTho.length >= 48) break;
  }

  // Linh kiện. Nằm giữa hai khối khác nhau ⇒ nó nằm TRÊN một sợi dây: đề
  // dặn model đừng ghi sợi đó vào "day", nên thiếu thì tự thêm.
  const linhKien: MachDien['linhKien'] = [];
  for (const x of Array.isArray(o.linhKien) ? o.linhKien : []) {
    const l = (x ?? {}) as Record<string, unknown>;
    if (!(LOAI_LINH_KIEN as readonly string[]).includes(String(l.loai))) continue;
    const a = timChan(l.a), b = timChan(l.b);
    if (!a || !b || trung(a, b)) continue;
    const giaTri = sachChu(l.giaTri, 16), nhan = sachChu(l.nhan, 40);
    linhKien.push({ loai: l.loai as LoaiLinhKien, a, b, ...(giaTri ? { giaTri } : {}), ...(nhan ? { nhan } : {}) });
    if (a.khoi !== b.khoi && !dayTho.some((e) => (trung(e.tu, a) && trung(e.toi, b)) || (trung(e.tu, b) && trung(e.toi, a)))) {
      dayTho.push({ tu: a, toi: b, mau: null });
    }
    if (linhKien.length >= 12) break;
  }
  if (!dayTho.length) return null;

  // Bo chính = VI ĐIỀU KHIỂN, dù model nói gì. Đo 01/10 với đề L298N + ESP32:
  // model chọn L298N vì "nhiều dây nhất", ESP32 bị đẩy sang trái thành một
  // module — đọc sơ đồ phải tìm GPIO ở cột sai. Không có mcu thì nghe model,
  // model sai thì lấy khối nhiều đầu dây nhất.
  const dem = new Map<string, number>();
  for (const d of dayTho) for (const e of [d.tu, d.toi]) dem.set(e.khoi, (dem.get(e.khoi) ?? 0) + 1);
  const nhieuDayNhat = (ds: string[]) => [...ds].sort((a, b) => (dem.get(b) ?? 0) - (dem.get(a) ?? 0))[0];
  const cacMcu = khoi.filter((k) => k.loai === 'mcu').map((k) => k.id);
  let chinh = idSach(o.chinh);
  if (cacMcu.length) chinh = nhieuDayNhat(cacMcu);
  else if (!khoi.some((k) => k.id === chinh)) chinh = nhieuDayNhat(khoi.map((k) => k.id));

  // Định hướng: đầu phía bo chính luôn là `toi` — app dựa vào đó để dàn hàng.
  for (const d of dayTho) if (d.tu.khoi === chinh && d.toi.khoi !== chinh) [d.tu, d.toi] = [d.toi, d.tu];

  // Tô màu: màu đề nói > màu theo chân nguồn > vòng màu tín hiệu (né màu đề đã dùng).
  const daDung = new Set(dayTho.map((d) => d.mau).filter(Boolean) as MaMau[]);
  const vong = VONG_TIN_HIEU.filter((m) => !daDung.has(m));
  const vongDung = vong.length ? vong : VONG_TIN_HIEU;
  let iVong = 0;
  const day: MachDien['day'] = dayTho.map((d) => {
    const ma = d.mau ?? mauTheoChan(d.toi.chan) ?? mauTheoChan(d.tu.chan) ?? vongDung[iVong++ % vongDung.length];
    return { tu: d.tu, toi: d.toi, mau: MAU[ma].hex, tenMau: MAU[ma].ten, ...(d.nhan ? { nhan: d.nhan } : {}) };
  });

  // Chân để hở — chân đang có dây thì dây thắng (model tự mâu thuẫn).
  const coDay = (c: ChanRef) => day.some((d) => trung(d.tu, c) || trung(d.toi, c));
  const deHo: MachDien['deHo'] = [];
  for (const x of Array.isArray(o.deHo) ? o.deHo : []) {
    const r = (x ?? {}) as Record<string, unknown>;
    const c = timChan(r);
    if (!c || coDay(c) || deHo.some((e) => trung(e, c))) continue;
    const nhan = sachChu(r.nhan, 40);
    deHo.push({ ...c, ...(nhan ? { nhan } : {}) });
    if (deHo.length >= 20) break;
  }

  const ghiChuChan: MachDien['ghiChuChan'] = [];
  for (const x of Array.isArray(o.ghiChuChan) ? o.ghiChuChan : []) {
    const r = (x ?? {}) as Record<string, unknown>;
    const c = timChan(r);
    const nhan = sachChu(r.nhan, 44);
    if (!c || !nhan || ghiChuChan.some((e) => trung(e, c))) continue;
    ghiChuChan.push({ ...c, nhan });
    if (ghiChuChan.length >= 24) break;
  }

  const canhBao = (Array.isArray(o.canhBao) ? o.canhBao : [])
    .map((s) => sachChu(s, 140)).filter((s) => s.length > 3).slice(0, 8);

  return {
    tieuDe: sachChu(o.tieuDe, 60) || sachChu(de, 60),
    chinh, khoi, day, deHo, linhKien, ghiChuChan, canhBao,
  };
}

// ── Việc chính ─────────────────────────────────────────────────────────

export async function veMach(userId: number, b: { de?: unknown }) {
  const de = String(b.de ?? '').trim();
  if (de.length < 2) throw new BadRequestError('Bạn muốn vẽ mạch gì?');
  if (de.length > DE_TOI_DA) {
    throw new BadRequestError(`Mô tả dài ${de.length} ký tự — tối đa ${DE_TOI_DA}. Tách thành hai sơ đồ nhé.`, 'DE_QUA_DAI');
  }
  if (!isAiAvailable()) throw new AppError('Tính năng AI chưa được cấu hình hoặc đang tạm ngắt.', 503, 'AI_UNAVAILABLE');
  if (!(await checkTokenQuota(userId))) {
    throw new AppError('Đã hết hạn mức AI hôm nay. Thử lại vào ngày mai.', 429, 'QUOTA_EXCEEDED');
  }
  const kq = await llmComplete({
    step: 'generation', feature: 'chat', purpose: 'mach_dien', userId,
    system: SYSTEM,
    messages: [{ role: 'user', content: `Mạch: ${de}` }],
    // 10 khối + 40 dây ≈ 3.000 token JSON. 8.000 đủ cả phần suy luận ẩn của GPT.
    maxTokens: 8000, maxRetries: 1, timeoutMs: 120_000,
  });
  const mach = donMach(tachJson(kq?.text ?? ''), de);
  if (!mach) {
    throw new AppError('AI chưa tách được sơ đồ này — kể rõ các module và từng chân nối vào đâu.', 502, 'MACH_RONG');
  }
  return { ...mach, model: kq.model };
}

// ── Chạy nền (cùng lý do với `/vo/ve/viec`: Cloudflare cắt ở 100 giây) ──

type Viec = { userId: number; luc: number; ketQua?: unknown; loi?: { thongDiep: string; ma: string; status: number } };
const cacViec = new Map<string, Viec>();
const SONG_MS = 15 * 60_000;

export function batDauMach(userId: number, b: { de?: unknown }) {
  const bay = Date.now() - SONG_MS;
  for (const [id, v] of cacViec) if (v.luc < bay) cacViec.delete(id);
  // Kiểm độ dài NGAY, đừng để lỗi nằm trong việc nền: người dùng phải thấy
  // câu báo liền, không phải chờ hết một vòng hỏi lại.
  const de = String(b.de ?? '').trim();
  if (de.length > DE_TOI_DA) {
    throw new BadRequestError(`Mô tả dài ${de.length} ký tự — tối đa ${DE_TOI_DA}. Tách thành hai sơ đồ nhé.`, 'DE_QUA_DAI');
  }
  const dangChay = [...cacViec.values()].filter((v) => v.userId === userId && !v.ketQua && !v.loi).length;
  if (dangChay >= 3) throw new AppError('Đang dựng 3 sơ đồ rồi — đợi xong đã nhé.', 429, 'MACH_BAN');
  const id = crypto.randomUUID();
  const viec: Viec = { userId, luc: Date.now() };
  cacViec.set(id, viec);
  veMach(userId, b).then(
    (kq) => { viec.ketQua = kq; },
    (e: { message?: string; code?: string; statusCode?: number }) => {
      viec.loi = { thongDiep: e?.message || 'AI chưa tách được sơ đồ này', ma: e?.code || 'MACH_LOI', status: e?.statusCode || 502 };
    },
  );
  return { viec: id };
}

export function xemViecMach(userId: number, id: string) {
  const v = cacViec.get(id);
  if (!v || v.userId !== userId) throw new AppError('Không tìm thấy lượt dựng sơ đồ này (có thể đã quá 15 phút).', 404, 'MACH_KHONG_CO');
  if (v.loi) throw new AppError(v.loi.thongDiep, v.loi.status, v.loi.ma);
  if (!v.ketQua) return { xong: false, giay: Math.round((Date.now() - v.luc) / 1000) };
  return { xong: true, ...(v.ketQua as object) };
}
