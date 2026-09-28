/**
 * Vở viết tay (iPad) — "✍️ AI viết lại trang".
 * ─────────────────────────────────────────────────────────────────────
 * Người dùng viết vội, cẩu thả. Bấm một nút: app chụp ẢNH trang (nét bút
 * trên nền trắng) gửi lên đây, model thị giác đọc rồi trả lại ĐÚNG nội dung đó
 * dưới dạng khối có cấu trúc — tiêu đề, đoạn, danh sách, bảng, công thức,
 * code, ghi chú — đã sửa chính tả / dấu tiếng Việt / viết hoa / dấu câu.
 * App tự dựng các khối thành bản "chữ tay đẹp" căn theo dòng kẻ của giấy.
 *
 * Vì sao trả KHỐI chứ không trả Markdown/HTML: app dựng từng khối lên đúng
 * dòng kẻ của giấy (bảng phải biết số cột, công thức phải căn giữa, code phải
 * giữ thụt lề). Markdown thì app lại phải viết bộ đọc Markdown.
 *
 * ─── Luật cứng ───
 * GIỮ NGUYÊN Ý và thứ tự — chỉ sửa chữ, không thêm ý. Lời dặn nằm trong
 * prompt, còn MÃ chỉ canh được phần đo được:
 *   • chuẩn hoá hình dạng (mọi hàng bảng cùng số cột, trần độ dài, bỏ khối rỗng)
 *   • đếm chữ `[?]` (chỗ không đọc được) để app báo người dùng xem lại
 *   • bản sạch DÀI HƠN hẳn chữ máy đọc được trên iPad ⇒ cảnh báo "có thể đã
 *     thêm ý" (chỉ khi gợi ý đủ dài để so — gợi ý Vision của chữ cẩu thả hay
 *     thiếu, nên chỉ cảnh báo, không từ chối)
 *
 * Ảnh KHÔNG được lưu: nhận base64 trong thân JSON, gửi thẳng cho cổng, xong.
 * Model: `vo_viet_lai` = `gpt-6-sol` (model GPT duy nhất của cổng nhìn ảnh thật).
 */
import crypto from 'node:crypto';
import { AppError, BadRequestError } from '../middleware/errorHandler.js';
import { checkTokenQuota, isAiAvailable } from './interview/llm/index.js';
import { visionComplete, type VisionImage } from './docTools/vision.js';

/** ~1,5MB ảnh thật ≈ 2MB base64. App gửi JPEG ~1600px cạnh dài, ~300–700KB. */
const MAX_B64 = 2_100_000;
const MAX_GOI_Y = 6000;
const MAX_KHOI = 80;
const MAX_CHU_KHOI = 3000;
const MAX_HANG = 40;
const MAX_COT = 8;
const MAX_MUC = 60;
const MAX_SUA = 40;

export type LoaiSua = 'chinhTa' | 'dau' | 'vietHoa' | 'dauCau' | 'vietTat' | 'khac';
export type KhoiVietLai =
  | { loai: 'tieuDe'; cap: 1 | 2 | 3; chu: string }
  | { loai: 'doan'; chu: string }
  | { loai: 'danhSach'; kieu: 'gach' | 'so'; muc: string[] }
  | { loai: 'bang'; coTieuDe: boolean; hang: string[][] }
  | { loai: 'congThuc'; chu: string; latex: string }
  | { loai: 'code'; ngonNgu: string; chu: string }
  | { loai: 'ghiChu'; chu: string };
export interface SuaVietLai { truoc: string; sau: string; loai: LoaiSua }

const GIAY: Record<string, string> = {
  trang: 'giấy trắng trơn', keNgang: 'giấy kẻ ngang', oLy: 'giấy ô ly', cham: 'giấy chấm',
  cornell: 'giấy Cornell (cột từ khoá bên trái, tóm tắt ở đáy)', genkou: 'giấy ô vuông 原稿用紙',
  nhacLy: 'giấy khuông nhạc', bonDong: 'giấy 4 dòng tập viết tiếng Anh', luoiCode: 'lưới viết code',
};

export const SYSTEM_VIET_LAI = [
  'Bạn là người CHÉP VỞ SẠCH. Ảnh là MỘT trang vở viết tay (Apple Pencil) của một người học Việt Nam — thường viết vội, cẩu thả, sai dấu.',
  'Việc của bạn: đọc trang rồi chép lại ĐÚNG nội dung đó thành bản sạch, có cấu trúc.',
  '',
  'LUẬT CỨNG:',
  '1. GIỮ NGUYÊN Ý, thứ tự và thứ tiếng của người viết. KHÔNG thêm ý, không giải thích, không tóm tắt, không trả lời câu hỏi trong trang, không giải bài, không dịch, không bổ sung chữ còn thiếu của một câu viết dở.',
  '2. CHỈ được sửa: chính tả, dấu tiếng Việt (thiếu/sai dấu), viết hoa đầu câu và tên riêng, dấu câu, ngắt câu, ngắt đoạn, khoảng trắng. Viết tắt kiểu chat ("ko", "k", "đc", "dc", "vs", "j", "ntn", "bn") thì viết đủ ("không", "được", "với", "gì", "như thế nào", "bao nhiêu") — CHỈ khi chắc chắn nghĩa. Viết tắt chuyên môn (CPU, HTTP, VD:, tr., đ/n) và ký hiệu (→, ⇒, =, ≈, ∈, Δ, ∀) GIỮ NGUYÊN.',
  '3. Chữ không đọc được: viết [?] đúng chỗ đó. KHÔNG đoán bừa một từ nghe hợp lý. Chữ bị gạch xoá: bỏ đi.',
  '4. Trộn Việt/Anh/Nhật: giữ đúng từng thứ tiếng như trong trang. Chữ Nhật (kana/kanji) chép đúng TỪNG KÝ TỰ; furigana nếu có thì đặt trong ngoặc ngay sau chữ Hán, vd 漢字(かんじ). Không tự thêm furigana, không tự thêm nghĩa.',
  '5. Nhận ra cấu trúc có SẴN trong trang: tiêu đề (chữ to / gạch chân / đứng riêng đầu trang hay đầu mục), danh sách (gạch đầu dòng, 1. 2. 3., a) b), -), BẢNG (có kẻ ô, HOẶC thông tin xếp thành cột thẳng hàng như "từ — nghĩa"), công thức toán/lý/hoá, đoạn code, ghi chú đóng khung / bên lề / có dấu ★ !.',
  '6. Không bỏ chữ nào có nghĩa: nhãn viết trước một công thức/bảng (vd "công thức:", "CT:", "VD:") thì giữ thành một khối doan ngắn ngay trước khối đó.',
  '7. Hình vẽ, sơ đồ: KHÔNG mô tả, KHÔNG vẽ lại. Chỉ chép chữ nằm trong hình nếu có; mũi tên nối hai ý thì viết "A → B".',
  '8. "Gợi ý máy đọc" (nếu có) do iPad tự đọc, hay sai — ẢNH mới là nguồn đúng. Đừng chép gợi ý nếu ảnh không có chữ đó.',
  '',
  'ĐẦU RA: DUY NHẤT một đối tượng JSON (không markdown, không ```), đúng khuôn:',
  '{"khoi":[...],"sua":[...]}',
  'Mỗi phần tử của "khoi" là MỘT trong các dạng, theo đúng thứ tự trên trang (trên xuống, trái sang phải):',
  '{"loai":"tieuDe","cap":1,"chu":"..."}   — cap 1 = tiêu đề trang, 2 = mục, 3 = mục con',
  '{"loai":"doan","chu":"..."}   — một đoạn văn. Chỉ dùng \\n trong đoạn khi trang cố ý xuống dòng (thơ, từng dòng định nghĩa ngắn).',
  '{"loai":"danhSach","kieu":"gach","muc":["...","..."]}   — kieu "so" nếu đánh số; mục con thì mở đầu chuỗi bằng 2 dấu cách cho mỗi cấp thụt. KHÔNG tự viết ký hiệu gạch/số vào đầu mục.',
  '{"loai":"bang","coTieuDe":true,"hang":[["ô","ô"],["ô","ô"]]}   — mọi hàng CÙNG số cột; ô trống là "".',
  '{"loai":"congThuc","chu":"dạng đọc được bằng ký tự Unicode: x², x₁, √, ∫, Σ, ≤, ≠, α, π, →, phân số viết a/b","latex":"cùng công thức ở dạng LaTeX"}',
  '{"loai":"code","ngonNgu":"python|java|js|sql|c|cpp|bash|…|\\"\\"","chu":"giữ nguyên thụt lề bằng dấu cách, mỗi dòng code một dòng"}',
  '{"loai":"ghiChu","chu":"..."}',
  '"sua": những chỗ ĐÃ SỬA so với chữ viết trong trang (tối đa 40, ưu tiên chỗ quan trọng): {"truoc":"chữ như trong trang","sau":"chữ đã sửa","loai":"chinhTa|dau|vietHoa|dauCau|vietTat|khac"}. Không liệt kê chỗ không đổi.',
  'Trang không có chữ nào: {"khoi":[],"sua":[]}',
].join('\n');

// ── Đầu vào ─────────────────────────────────────────────────────────────

function docAnh(raw: unknown): VisionImage {
  let s = String(raw ?? '').trim();
  const pre = /^data:(image\/(?:png|jpeg|webp));base64,/.exec(s);
  if (pre) s = s.slice(pre[0].length);
  s = s.replace(/\s+/g, '');
  if (!s) throw new BadRequestError('Thiếu ảnh trang', 'THIEU_ANH');
  if (s.length > MAX_B64) throw new BadRequestError('Ảnh trang quá lớn (tối đa ~1,5MB)', 'ANH_QUA_LON');
  if (!/^[A-Za-z0-9+/]+=*$/.test(s)) throw new BadRequestError('Ảnh trang không phải base64 hợp lệ', 'ANH_HONG');
  // Nhận dạng theo byte đầu, không tin tiền tố người gửi khai.
  const mediaType = s.startsWith('/9j/') ? 'image/jpeg' : s.startsWith('iVBOR') ? 'image/png'
    : s.startsWith('UklGR') ? 'image/webp' : '';
  if (!mediaType) throw new BadRequestError('Ảnh trang phải là JPEG, PNG hoặc WebP', 'ANH_HONG');
  return { data: s, mediaType };
}

// ── Chuẩn hoá đầu ra ────────────────────────────────────────────────────

const chuoi = (v: unknown, max = MAX_CHU_KHOI): string =>
  String(v ?? '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, max);
const gon = (v: unknown, max = MAX_CHU_KHOI) => chuoi(v, max).trim();

/** Bỏ ký hiệu đầu mục mà model lỡ viết vào chữ ("- ", "• ", "1. ", "a) "). App tự vẽ. */
function boDauMuc(s: string): string {
  const m = /^(\s*)(?:[-–•*·]\s+|\d{1,3}[.)]\s+|[a-zA-Z][.)]\s+)(.*)$/s.exec(s);
  return m ? m[1] + m[2] : s;
}

export function chuanHoaKhoi(raw: unknown): KhoiVietLai | null {
  if (!raw || typeof raw !== 'object') return null;
  const k = raw as Record<string, unknown>;
  switch (k.loai) {
    case 'tieuDe': {
      const chu = gon(k.chu, 300);
      if (!chu) return null;
      const cap = Number(k.cap);
      return { loai: 'tieuDe', cap: cap === 2 ? 2 : cap === 3 ? 3 : 1, chu };
    }
    case 'doan': case 'ghiChu': {
      const chu = gon(k.chu);
      return chu ? { loai: k.loai, chu } : null;
    }
    case 'danhSach': {
      const muc = (Array.isArray(k.muc) ? k.muc : [])
        .map((m) => boDauMuc(chuoi(m, 1000).replace(/\s+$/, '')))
        .filter((m) => m.trim())
        .slice(0, MAX_MUC);
      return muc.length ? { loai: 'danhSach', kieu: k.kieu === 'so' ? 'so' : 'gach', muc } : null;
    }
    case 'bang': {
      let hang = (Array.isArray(k.hang) ? k.hang : [])
        .filter(Array.isArray)
        .slice(0, MAX_HANG)
        .map((h) => (h as unknown[]).slice(0, MAX_COT).map((o) => gon(o, 400)));
      hang = hang.filter((h) => h.some((o) => o));
      if (!hang.length) return null;
      // Mọi hàng CÙNG số cột — app dựng lưới theo số này.
      const soCot = Math.max(...hang.map((h) => h.length));
      hang = hang.map((h) => [...h, ...Array(soCot - h.length).fill('')]);
      return { loai: 'bang', coTieuDe: k.coTieuDe !== false && hang.length > 1, hang };
    }
    case 'congThuc': {
      const chu = gon(k.chu, 600);
      const latex = gon(k.latex, 600);
      if (!chu && !latex) return null;
      return { loai: 'congThuc', chu: chu || latex, latex };
    }
    case 'code': {
      // Code: giữ khoảng trắng đầu dòng, chỉ bỏ dòng trống đầu/cuối.
      const chu = chuoi(k.chu).replace(/^\s*\n/, '').replace(/\s+$/, '');
      if (!chu.trim()) return null;
      return { loai: 'code', ngonNgu: gon(k.ngonNgu, 20).toLowerCase(), chu };
    }
    default:
      return null;
  }
}

const LOAI_SUA = new Set<LoaiSua>(['chinhTa', 'dau', 'vietHoa', 'dauCau', 'vietTat', 'khac']);

export function chuanHoaSua(raw: unknown): SuaVietLai[] {
  const ds = Array.isArray(raw) ? raw : [];
  const kq: SuaVietLai[] = [];
  const daCo = new Set<string>();
  for (const x of ds) {
    if (!x || typeof x !== 'object') continue;
    const s = x as Record<string, unknown>;
    const truoc = gon(s.truoc, 200), sau = gon(s.sau, 200);
    if (!sau || truoc === sau) continue;
    const khoa = `${truoc}→${sau}`;
    if (daCo.has(khoa)) continue;
    daCo.add(khoa);
    kq.push({ truoc, sau, loai: LOAI_SUA.has(s.loai as LoaiSua) ? (s.loai as LoaiSua) : 'khac' });
    if (kq.length >= MAX_SUA) break;
  }
  return kq;
}

/** Chữ thuần của cả trang — app lưu làm chỉ mục tìm kiếm (`chuNhanDang`). */
export function chuThuanCuaKhoi(khoi: KhoiVietLai[]): string {
  return khoi.map((k) => {
    switch (k.loai) {
      case 'danhSach': return k.muc.map((m) => m.trim()).join('\n');
      case 'bang': return k.hang.map((h) => h.join(' | ')).join('\n');
      case 'congThuc': return k.chu;
      default: return k.chu;
    }
  }).join('\n');
}

/** Lấy đối tượng JSON trong câu trả lời (model đôi khi bọc ``` hoặc nói thêm một câu). */
export function tachJson(text: string): Record<string, unknown> | null {
  const s = text.replace(/^\s*```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  try {
    const o = JSON.parse(s.slice(a, b + 1));
    return o && typeof o === 'object' && !Array.isArray(o) ? o : null;
  } catch {
    return null;
  }
}

/** Đếm "chữ" (từ Latin + từng ký tự CJK) — thước đo thô để so độ dài hai bản. */
function demChu(s: string): number {
  const cjk = (s.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu) ?? []).length;
  const latin = (s.replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu, ' ')
    .match(/[\p{L}\p{N}]+/gu) ?? []).length;
  return cjk + latin;
}

// ── Việc chính ─────────────────────────────────────────────────────────

export async function vietLaiTrang(userId: number, b: {
  anh?: unknown; goiY?: unknown; giay?: unknown;
}) {
  const img = docAnh(b.anh);
  const goiY = gon(b.goiY, MAX_GOI_Y);
  const giay = GIAY[String(b.giay ?? '')] ?? 'giấy vở';

  if (!isAiAvailable()) {
    throw new AppError('Tính năng AI chưa được cấu hình hoặc đang tạm ngắt.', 503, 'AI_UNAVAILABLE');
  }
  if (!(await checkTokenQuota(userId))) {
    throw new AppError('Đã hết hạn mức AI hôm nay. Thử lại vào ngày mai.', 429, 'QUOTA_EXCEEDED');
  }

  const userText = [
    `Loại giấy: ${giay}.`,
    goiY
      ? `Gợi ý máy đọc trên iPad (hay sai, chỉ tham khảo — ảnh mới là nguồn đúng):\n<<<\n${goiY}\n>>>`
      : 'Không có gợi ý máy đọc.',
    'Chép sạch trang này theo đúng luật và đúng khuôn JSON.',
  ].join('\n\n');

  let text: string;
  let model: string;
  try {
    const kq = await visionComplete({
      purpose: 'vo_viet_lai',
      system: SYSTEM_VIET_LAI,
      userText,
      images: [img],
      // Một trang vở dày ≈ 600–1.500 token ra (đo 28/09). 6.000 đủ cho trang
      // kín chữ + danh sách sửa, mà một lượt lạc đề không đốt vô hạn.
      maxTokens: 6000,
      maxRetries: 1,
      timeoutMs: 150_000,
      userId,
    });
    text = kq.text;
    model = kq.model;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError('AI chưa đọc được trang này — thử lại sau ít phút.', 502, 'AI_LOI');
  }

  const o = tachJson(text);
  if (!o) throw new AppError('AI trả về sai khuôn — thử lại.', 502, 'VIET_LAI_HONG');

  const khoi = (Array.isArray(o.khoi) ? o.khoi : [])
    .map(chuanHoaKhoi)
    .filter((k): k is KhoiVietLai => k !== null)
    .slice(0, MAX_KHOI);
  if (!khoi.length) {
    throw new AppError('Không đọc ra chữ nào trên trang này.', 422, 'TRANG_TRONG');
  }
  const sua = chuanHoaSua(o.sua);
  const chuThuan = chuThuanCuaKhoi(khoi);

  const canhBao: string[] = [];
  const soKhongDoc = (chuThuan.match(/\[\?\]/g) ?? []).length;
  if (soKhongDoc > 0) {
    canhBao.push(`Có ${soKhongDoc} chỗ AI không đọc được, đánh dấu [?] — xem lại trước khi lưu.`);
  }
  // Gợi ý Vision của chữ cẩu thả hay THIẾU chữ, nên chỉ so khi gợi ý đủ dài,
  // và ngưỡng rộng. Vượt ngưỡng không có nghĩa chắc chắn là bịa — chỉ là lý
  // do để người dùng đọc kỹ trước khi bấm Lưu.
  const nGoc = demChu(goiY), nMoi = demChu(chuThuan);
  if (nGoc >= 30 && nMoi > nGoc * 1.8 + 15) {
    canhBao.push('Bản viết lại dài hơn nhiều so với chữ iPad đọc được — kiểm tra xem AI có thêm ý nào không.');
  }

  return { khoi, sua, chuThuan, canhBao, soKhongDoc, model };
}

// ── Chạy nền ───────────────────────────────────────────────────────────
//
// ⚠️ Cloudflare đứng trước máy chủ và CẮT mọi yêu cầu chờ quá 100 giây (524).
// Một trang dày chạy 20–90 giây (đo 28/09: 39s), sát trần. Nên app gửi việc
// rồi hỏi lại mỗi vài giây — cùng mẫu với `batDauVe` (voVe.service.ts). Giữ
// trong bộ nhớ là đủ: một tiến trình backend, kết quả sống 15 phút.

type ViecVietLai = {
  userId: number; luc: number; ketQua?: unknown;
  loi?: { thongDiep: string; ma: string; status: number };
};
const cacViec = new Map<string, ViecVietLai>();
const SONG_MS = 15 * 60_000;

export function batDauVietLai(userId: number, b: { anh?: unknown; goiY?: unknown; giay?: unknown }) {
  const bay = Date.now() - SONG_MS;
  for (const [id, v] of cacViec) if (v.luc < bay) cacViec.delete(id);
  // Ảnh hỏng thì báo NGAY bằng mã, không bắt app chờ một vòng hỏi lại.
  docAnh(b.anh);
  const dangChay = [...cacViec.values()].filter((v) => v.userId === userId && !v.ketQua && !v.loi).length;
  if (dangChay >= 2) throw new AppError('Đang viết lại 2 trang rồi — đợi xong đã nhé.', 429, 'VIET_LAI_BAN');
  const id = crypto.randomUUID();
  const viec: ViecVietLai = { userId, luc: Date.now() };
  cacViec.set(id, viec);
  vietLaiTrang(userId, b).then(
    (kq) => { viec.ketQua = kq; },
    (e: { message?: string; code?: string; statusCode?: number }) => {
      viec.loi = { thongDiep: e?.message || 'AI chưa chép được trang này', ma: e?.code || 'AI_LOI', status: e?.statusCode || 502 };
    },
  );
  return { viec: id };
}

export function xemViecVietLai(userId: number, id: string) {
  const v = cacViec.get(id);
  if (!v || v.userId !== userId) {
    throw new AppError('Không tìm thấy lượt viết lại này (có thể đã quá 15 phút).', 404, 'VIET_LAI_KHONG_CO');
  }
  if (v.loi) throw new AppError(v.loi.thongDiep, v.loi.status, v.loi.ma);
  if (!v.ketQua) return { xong: false, giay: Math.round((Date.now() - v.luc) / 1000) };
  return { xong: true, ...(v.ketQua as object) };
}
