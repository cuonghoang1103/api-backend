/**
 * Vở viết tay (iPad) — "Vẽ giúp → Luồng / sơ đồ khối".
 * ─────────────────────────────────────────────────────────────────────
 * Cho giảng lập trình: "mô hình MVC", "luồng đăng nhập JWT: client → API →
 * DB", "vòng đời request Express"… Model chỉ trả CẤU TRÚC đồ thị:
 *
 *   { tieuDe, dang: 'luong' | 'tuan_tu', huong: 'TB' | 'LR',
 *     nut:  [{ id, nhan, loai: hop|quyet_dinh|csdl|nguoi|tron, nhom? }],
 *     nhom: [{ id, nhan }],
 *     canh: [{ tu, toi, nhan? }] }
 *
 * App tự dàn bố cục (phân tầng, căn hàng, mũi tên gấp khúc) và viết CHỮ bằng
 * phông nét đơn. Vì sao không để model vẽ SVG như `ve_net`: đo trên `ve_net`,
 * model vẽ hộp lệch, mũi tên chéo đè chữ, và KHÔNG được viết chữ (không có
 * <text>) — mà sơ đồ khối không có chữ thì vô dụng. Cấu trúc thì model giỏi,
 * hình học thì mã giỏi: chia đúng việc.
 *
 * ⚠️ Chữ đi ra phải nằm trong bảng ký tự phông nét đơn của app: Latin +
 * tiếng Việt + số + dấu câu ASCII. `sachNhan` đổi → thành ->, bỏ emoji/chữ Hán.
 */
import crypto from 'node:crypto';
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';
import { AppError, BadRequestError } from '../middleware/errorHandler.js';
import { tachJson } from './voVietLai.service.js';

const LOAI_NUT = ['hop', 'quyet_dinh', 'csdl', 'nguoi', 'tron'] as const;
type LoaiNut = (typeof LOAI_NUT)[number];

export interface DoThiKhoi {
  tieuDe: string;
  dang: 'luong' | 'tuan_tu';
  huong: 'TB' | 'LR';
  nut: { id: string; nhan: string; loai: LoaiNut; nhom?: string }[];
  nhom: { id: string; nhan: string }[];
  canh: { tu: string; toi: string; nhan?: string }[];
}

const SYSTEM = [
  'Bạn là giảng viên lập trình vẽ sơ đồ lên bảng cho sinh viên Việt Nam.',
  'Từ mô tả, dựng ĐỒ THỊ của sơ đồ. Trả về DUY NHẤT một đối tượng JSON, không giải thích, đúng dạng:',
  '{"tieuDe":"Mô hình MVC","dang":"luong","huong":"TB","nut":[{"id":"u","nhan":"Người dùng","loai":"nguoi"},{"id":"c","nhan":"Controller","loai":"hop","nhom":"sv"},{"id":"db","nhan":"Cơ sở dữ liệu","loai":"csdl"}],"nhom":[{"id":"sv","nhan":"Máy chủ"}],"canh":[{"tu":"u","toi":"c","nhan":"yêu cầu"}]}',
  'Quy tắc:',
  '- "dang": "luong" cho sơ đồ khối / kiến trúc / flowchart; "tuan_tu" cho sơ đồ tuần tự (sequence) khi mô tả là chuỗi thông điệp qua lại giữa các bên theo thời gian (vd luồng đăng nhập, bắt tay TCP). Với "tuan_tu": "nut" là các bên tham gia theo thứ tự trái → phải, "canh" là các thông điệp THEO ĐÚNG THỨ TỰ thời gian (có thể lặp cặp tu/toi), và không dùng "nhom".',
  '- "huong": "TB" (trên xuống) mặc định; "LR" (trái sang phải) khi là chuỗi ngắn ≤ 5 bước nối tiếp.',
  '- "loai": "nguoi" = người dùng/tác nhân, "csdl" = cơ sở dữ liệu/bộ nhớ đệm/kho lưu (DB, Redis, S3), "quyet_dinh" = câu hỏi rẽ nhánh trong flowchart (nhãn là câu hỏi ngắn, cạnh ra có nhãn "có"/"không"), "tron" = bắt đầu/kết thúc của flowchart, "hop" = còn lại.',
  '- "nhom": khối bao các nút cùng tầng/cùng máy (vd "Backend", "Trình duyệt"). Tuỳ chọn, tối đa 4 nhóm; mỗi nút thuộc tối đa 1 nhóm.',
  '- Nhãn NGẮN: nút ≤ 24 ký tự, cạnh ≤ 18 ký tự (động từ/danh từ ngắn: "gửi request", "truy vấn", "JSON"). Tiếng Việt có dấu; tên kỹ thuật giữ nguyên (Controller, JWT, Redis). KHÔNG dùng emoji, mũi tên unicode, chữ Hán.',
  '- 3–12 nút, tối đa 16 cạnh (tuần tự tối đa 14 thông điệp). Chỉ vẽ ý CHÍNH, đủ để giảng.',
  '- "id" ngắn không dấu, duy nhất.',
].join('\n');

/** Chữ nằm ngoài phông nét đơn của app thì đổi hoặc bỏ. */
export function sachNhan(s: unknown, dai: number): string {
  let t = String(s ?? '')
    .replace(/[→⟶➔➜]/g, '->').replace(/[←⟵]/g, '<-').replace(/[↔⟷]/g, '<->')
    .replace(/[–—−]/g, '-').replace(/[“”«»]/g, '"').replace(/[‘’]/g, "'").replace(/…/g, '...')
    .replace(/[×]/g, 'x');
  t = t.normalize('NFC').replace(/[^\p{Script=Latin}\p{N}\x20-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/gu, '');
  t = t.replace(/\s+/g, ' ').trim();
  return [...t].slice(0, dai).join('').trim();
}

const idSach = (v: unknown) => String(v ?? '').trim().slice(0, 40);

/** Kiểm + dọn đồ thị model trả. `null` nếu không dựng được sơ đồ nào. */
export function donDoThi(o: Record<string, unknown> | null, de: string): DoThiKhoi | null {
  if (!o) return null;
  const dang = o.dang === 'tuan_tu' ? 'tuan_tu' : 'luong';
  const huong = o.huong === 'LR' ? 'LR' : 'TB';
  const nhomTho = Array.isArray(o.nhom) ? o.nhom : [];
  const nhom: DoThiKhoi['nhom'] = [];
  if (dang === 'luong') {
    for (const x of nhomTho) {
      const g = (x ?? {}) as Record<string, unknown>;
      const id = idSach(g.id), nhan = sachNhan(g.nhan, 28);
      if (id && !nhom.some((n) => n.id === id)) nhom.push({ id, nhan });
      if (nhom.length >= 4) break;
    }
  }
  const nut: DoThiKhoi['nut'] = [];
  for (const x of Array.isArray(o.nut) ? o.nut : []) {
    const n = (x ?? {}) as Record<string, unknown>;
    const id = idSach(n.id);
    const nhan = sachNhan(n.nhan, 40) || id;
    if (!id || nut.some((k) => k.id === id)) continue;
    const loai = (LOAI_NUT as readonly string[]).includes(String(n.loai)) ? (n.loai as LoaiNut) : 'hop';
    const g = idSach(n.nhom);
    nut.push({ id, nhan, loai: dang === 'tuan_tu' && loai !== 'nguoi' ? (loai === 'csdl' ? 'csdl' : 'hop') : loai,
      ...(g && nhom.some((k) => k.id === g) ? { nhom: g } : {}) });
    if (nut.length >= 14) break;
  }
  if (nut.length < 2) return null;
  const canh: DoThiKhoi['canh'] = [];
  for (const x of Array.isArray(o.canh) ? o.canh : []) {
    const c = (x ?? {}) as Record<string, unknown>;
    const tu = idSach(c.tu), toi = idSach(c.toi);
    if (!nut.some((n) => n.id === tu) || !nut.some((n) => n.id === toi)) continue;
    if (tu === toi && dang === 'luong') continue;
    const nhan = sachNhan(c.nhan, 28);
    canh.push({ tu, toi, ...(nhan ? { nhan } : {}) });
    if (canh.length >= (dang === 'tuan_tu' ? 16 : 20)) break;
  }
  // Nhóm không còn nút nào thì bỏ.
  const nhomDung = nhom.filter((g) => nut.some((n) => n.nhom === g.id));
  return { tieuDe: sachNhan(o.tieuDe, 60) || sachNhan(de, 60), dang, huong, nut, nhom: nhomDung, canh };
}

export async function veSoDoKhoi(userId: number, b: { de?: unknown }) {
  const de = String(b.de ?? '').trim().slice(0, 500);
  if (de.length < 2) throw new BadRequestError('Bạn muốn vẽ sơ đồ gì?');
  if (!isAiAvailable()) throw new AppError('Tính năng AI chưa được cấu hình hoặc đang tạm ngắt.', 503, 'AI_UNAVAILABLE');
  if (!(await checkTokenQuota(userId))) {
    throw new AppError('Đã hết hạn mức AI hôm nay. Thử lại vào ngày mai.', 429, 'QUOTA_EXCEEDED');
  }
  const kq = await llmComplete({
    step: 'generation', feature: 'chat', purpose: 'so_do_khoi', userId,
    system: SYSTEM,
    messages: [{ role: 'user', content: `Sơ đồ: ${de}` }],
    // Đồ thị 12 nút + 16 cạnh ≈ 900 token JSON. 4.000 đủ cả phần suy luận ẩn.
    maxTokens: 4000, maxRetries: 1, timeoutMs: 90_000,
  });
  const doThi = donDoThi(tachJson(kq?.text ?? ''), de);
  if (!doThi) throw new AppError('AI chưa dựng được sơ đồ này — thử mô tả rõ hơn (các khối và luồng đi).', 502, 'SO_DO_RONG');
  return { ...doThi, model: kq.model };
}

// ── Chạy nền (cùng lý do với `/vo/ve/viec`: Cloudflare cắt ở 100 giây) ──

type Viec = { userId: number; luc: number; ketQua?: unknown; loi?: { thongDiep: string; ma: string; status: number } };
const cacViec = new Map<string, Viec>();
const SONG_MS = 15 * 60_000;

export function batDauSoDo(userId: number, b: { de?: unknown }) {
  const bay = Date.now() - SONG_MS;
  for (const [id, v] of cacViec) if (v.luc < bay) cacViec.delete(id);
  const dangChay = [...cacViec.values()].filter((v) => v.userId === userId && !v.ketQua && !v.loi).length;
  if (dangChay >= 3) throw new AppError('Đang dựng 3 sơ đồ rồi — đợi xong đã nhé.', 429, 'SO_DO_BAN');
  const id = crypto.randomUUID();
  const viec: Viec = { userId, luc: Date.now() };
  cacViec.set(id, viec);
  veSoDoKhoi(userId, b).then(
    (kq) => { viec.ketQua = kq; },
    (e: { message?: string; code?: string; statusCode?: number }) => {
      viec.loi = { thongDiep: e?.message || 'AI chưa dựng được sơ đồ này', ma: e?.code || 'SO_DO_LOI', status: e?.statusCode || 502 };
    },
  );
  return { viec: id };
}

export function xemViecSoDo(userId: number, id: string) {
  const v = cacViec.get(id);
  if (!v || v.userId !== userId) throw new AppError('Không tìm thấy lượt dựng sơ đồ này (có thể đã quá 15 phút).', 404, 'SO_DO_KHONG_CO');
  if (v.loi) throw new AppError(v.loi.thongDiep, v.loi.status, v.loi.ma);
  if (!v.ketQua) return { xong: false, giay: Math.round((Date.now() - v.luc) / 1000) };
  return { xong: true, ...(v.ketQua as object) };
}
