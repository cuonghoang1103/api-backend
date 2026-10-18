/**
 * ============================================================
 * BẢNG MODEL CUONGMINI — MỘT CHỖ DUY NHẤT (18/10/2026)
 * ============================================================
 *
 * Chủ app chốt (18/10/2026):
 *   • Cổng rambo.ai.vn bị gỡ khỏi danh sách chính (mã giữ, tắt bằng công tắc
 *     — `ramboBat()` ở `llm/gateway.ts`).
 *   • Cổng CHÍNH = modelapi ("CuongMini Core"), model mặc định = `gpt-6-sol`
 *     tên hiển thị "CuongMini Solid".
 *   • Cổng Anthropic chính hãng hiển thị là "CuongMini Code Max".
 *   • Pro dùng MIỄN PHÍ (không khoá, luôn có trần chi tiêu theo người): xem
 *     `khoa: 'free'` bên dưới.
 *   • Model còn lại dùng CHUNG một khoá (`chung`), riêng Invisible có khoá
 *     RIÊNG (`invisible`) vì quá đắt. Vé sống 48 giờ (`anthropicChinhHang/ve.ts`).
 *
 * App (desktop, CLI `/model`, extension VS Code) CHỈ hiện `ten` — không bao
 * giờ hiện `model` (tên thật) hay tên cổng thật. Thứ tự hiển thị = `nangLuc`
 * giảm dần; đổi thứ tự thì đổi con số, không đổi chỗ dòng.
 *
 * ⚠️ `mo`/`moEn` không được nhắc tên model thật hay tên cổng thật.
 */
import { goiDuocModel } from '../llm/gateway.js';

/** Tên của model đắt nhất — chủ app viết "Invisable"; dùng chính tả đúng. Đổi ở ĐÂY là đủ. */
export const TEN_INVISIBLE = 'CuongMini Invisible 5.1';

export type CongModel = 'anthropic' | 'modelapi';
/** `free` = Pro dùng không cần khoá · `chung` = khoá chung · `invisible` = khoá riêng của Invisible. */
export type LoaiKhoa = 'free' | 'chung' | 'invisible';

/** Tên CỔNG hiển thị — không lộ tên nhà cung cấp. */
export const TEN_CONG: Record<CongModel, string> = {
  anthropic: 'CuongMini Code Max',
  modelapi: 'CuongMini Core',
};

export interface MucModel {
  /** Mã app gửi lên. Trung tính — không chứa tên model thật. */
  id: string;
  /** Tên thật gửi cổng. KHÔNG BAO GIỜ trả cho app. */
  model: string;
  ten: string;
  mo: string;
  moEn: string;
  cong: CongModel;
  khoa: LoaiKhoa;
  /** Năng lực tương đối (cao → đứng trên). */
  nangLuc: number;
  /** Cửa sổ ngữ cảnh THẬT (token). */
  cuaSoToken: number;
  /** Trần token RA thật của model. */
  maxRa: number;
  /**
   * Model FREE tương đương ở CỔNG KIA — đích khi cổng của model này hỏng
   * (5xx, mất kết nối, hết credit, hết giờ). Không bao giờ là model đắt hơn
   * người dùng đã chọn khi model đó trả phí (luật "không tự nâng").
   */
  tuongDuong: string;
  /** Đọc được ảnh thật (đo). */
  nhinAnh: boolean;
  /** Model đắt bất thường ⇒ app hỏi xác nhận. */
  dat?: boolean;
}

/*
 * Cửa sổ / trần ra:
 *   • Anthropic 5.5 + Fable 5.1: đo `GET /v1/models/{id}` 17/10/2026 = 1.000.000 / 128.000
 *     (máy chủ còn đọc lại mỗi ngày — `caiDat.ts › gioiHanModel`).
 *   • GPT trên modelapi: cổng không công khai ⇒ theo hãng cho họ GPT-5/6 (400K vào / 128K ra).
 *     Sai thì cổng trả 400 rõ ràng ("context length"), không hỏng câm.
 */
const MOT_TRIEU = 1_000_000;
const GPT_CUA_SO = 400_000;
const RA_128K = 128_000;

/** Mã model mặc định — cũng là đích của mọi mã cũ/lạ. */
export const MA_MAC_DINH = 'cm-solid';

const BANG: readonly MucModel[] = Object.freeze(([
  {
    id: 'cm-invisible', model: 'claude-fable-5-1', ten: TEN_INVISIBLE,
    mo: '⚠ Đắt nhất — chỉ cho việc cực khó. Khoá riêng.',
    moEn: '⚠ Most expensive — only for extremely hard tasks. Separate key.',
    cong: 'anthropic', khoa: 'invisible', nangLuc: 100, cuaSoToken: MOT_TRIEU, maxRa: RA_128K,
    tuongDuong: 'cm-solid', nhinAnh: true, dat: true,
  },
  {
    id: 'cm-optimum', model: 'claude-opus-5-5', ten: 'CuongMini Optimum 5.5',
    mo: 'Mạnh — việc khó, refactor lớn, đọc cả kiến trúc. Cần khoá.',
    moEn: 'Strong — hard tasks, big refactors, whole-architecture reading. Needs a key.',
    cong: 'anthropic', khoa: 'chung', nangLuc: 90, cuaSoToken: MOT_TRIEU, maxRa: RA_128K,
    tuongDuong: 'cm-solid', nhinAnh: true,
  },
  {
    id: 'cm-sonic', model: 'claude-sonnet-5-5', ten: 'CuongMini Sonic 5.5',
    mo: 'Cân bằng — nhanh, giỏi code, ngữ cảnh 1 triệu token. Pro miễn phí.',
    moEn: 'Balanced — fast, strong at code, 1M-token context. Free on Pro.',
    cong: 'anthropic', khoa: 'free', nangLuc: 75, cuaSoToken: MOT_TRIEU, maxRa: RA_128K,
    tuongDuong: 'cm-solid', nhinAnh: true,
  },
  {
    id: 'cm-solid', model: 'gpt-6-sol', ten: 'CuongMini Solid',
    mo: 'Mặc định — chắc tay, nhìn được ảnh. Pro miễn phí.',
    moEn: 'Default — dependable, can see images. Free on Pro.',
    cong: 'modelapi', khoa: 'free', nangLuc: 70, cuaSoToken: GPT_CUA_SO, maxRa: RA_128K,
    tuongDuong: 'cm-sonic', nhinAnh: true,
  },
  {
    /* Đo 18/10/2026 trên vòng lặp agent (đọc 2 file + sửa 1 hàm + chạy test, 2 lượt): đúng 2/2,
       sổ cổng ~0,015 $/việc (≈ 0,85× Solid), 13–16 s. */
    id: 'cm-nova', model: 'gpt-6-luna', ten: 'CuongMini Nova',
    mo: 'Ngang Solid, rẻ hơn chút — nhanh. Pro miễn phí.',
    moEn: 'On par with Solid, slightly cheaper — fast. Free on Pro.',
    cong: 'modelapi', khoa: 'free', nangLuc: 68, cuaSoToken: GPT_CUA_SO, maxRa: RA_128K,
    tuongDuong: 'cm-sonic', nhinAnh: true,
  },
  {
    id: 'cm-shin', model: 'gpt-5.6-sol', ten: 'CuongMini Shin',
    mo: 'Thế hệ trước — ý kiến thứ hai (tốn ~2,5× Solid). Pro miễn phí.',
    moEn: 'Previous generation — a second opinion (~2.5× Solid cost). Free on Pro.',
    cong: 'modelapi', khoa: 'free', nangLuc: 60, cuaSoToken: GPT_CUA_SO, maxRa: RA_128K,
    tuongDuong: 'cm-sonic', nhinAnh: true,
  },
  {
    id: 'cm-heshin', model: 'claude-haiku-5-5', ten: 'CuongMini Heshin 5.5',
    mo: 'Nhẹ, nhanh — việc vặt, hỏi nhanh, sửa một file. Pro miễn phí.',
    moEn: 'Light and fast — small chores, quick questions, one-file edits. Free on Pro.',
    cong: 'anthropic', khoa: 'free', nangLuc: 50, cuaSoToken: MOT_TRIEU, maxRa: RA_128K,
    tuongDuong: 'cm-solid', nhinAnh: true,
  },
  {
    /* Đo 18/10/2026: đúng 2/2, sổ cổng ~0,005 $/việc (≈ 0,3× Solid) nhưng CHẬM: 3–5 phút cho việc nhỏ. */
    id: 'cm-eco', model: 'gpt-5.6-luna', ten: 'CuongMini Eco',
    mo: 'Rẻ nhất nhưng chậm (vài phút mỗi việc nhỏ) — việc không gấp. Pro miễn phí.',
    moEn: 'Cheapest but slow (minutes per small task) — for work that can wait. Free on Pro.',
    cong: 'modelapi', khoa: 'free', nangLuc: 45, cuaSoToken: GPT_CUA_SO, maxRa: RA_128K,
    tuongDuong: 'cm-heshin', nhinAnh: true,
  },
] as MucModel[]).sort((a, b) => b.nangLuc - a.nangLuc));

/** Toàn bảng, đã xếp năng lực cao → thấp. */
export function bangModel(): readonly MucModel[] {
  return BANG;
}

/**
 * Mã cũ ⇒ mã mới. App cũ còn gửi `cl-*` (cổng chính hãng 17/10) và mã của bảng
 * modelapi/rambo cũ — đều phải chạy được, không bắt người dùng cài lại app.
 */
const BI_DANH: Record<string, string> = {
  'cl-free': 'cm-heshin',
  'cl-haiku-5-5': 'cm-heshin',
  'cl-sonnet-5-5': 'cm-sonic',
  'cl-opus-5-5': 'cm-optimum',
  'cl-fable-5-1': 'cm-invisible',
  'gpt-sol': 'cm-solid',
  'gpt-6-sol': 'cm-solid',
  'gpt-5.6-sol': 'cm-shin',
  'gpt-6-luna': 'cm-nova',
  'gpt-5.6-luna': 'cm-eco',
};

/** Mã có phải của bảng này (kể cả bí danh) không. */
export function laMaCuongMini(id: unknown): id is string {
  return typeof id === 'string' && (BANG.some((m) => m.id === id) || id in BI_DANH);
}

/** Mã ⇒ mục. Mã lạ / trống ⇒ model mặc định (không bao giờ `null`). */
export function timModel(id: unknown): MucModel {
  const ma = typeof id === 'string' ? (BI_DANH[id] ?? id) : MA_MAC_DINH;
  return BANG.find((m) => m.id === ma) ?? BANG.find((m) => m.id === MA_MAC_DINH)!;
}

export function mucTheoId(id: string): MucModel | undefined {
  return BANG.find((m) => m.id === id);
}

/** Model free tương đương ở cổng kia. `null` = không có (bảng hỏng). */
export function tuongDuongFree(m: MucModel): MucModel | null {
  const d = BANG.find((x) => x.id === m.tuongDuong);
  if (!d || d.khoa !== 'free' || d.cong === m.cong) return null;
  return d;
}

/** Hạng của sổ `anthropic_usage_logs` (hai trần nhóm free/cao đã có từ 17/10). */
export function hangSo(m: MucModel): 'free' | 'cao' {
  return m.khoa === 'free' ? 'free' : 'cao';
}

/** Model modelapi gọi được với khoá nhóm đang cắm? (Anthropic: kiểm kho key riêng.) */
export function modelapiGoiDuoc(m: MucModel): boolean {
  return m.cong !== 'modelapi' || goiDuocModel(m.model);
}

// ─── Cầu dao theo CỔNG (tự chuyển cổng, 18/10/2026) ───────────────────

/**
 * Cổng vừa hỏng ⇒ nghỉ 60 giây: lượt sau (bước kế của cùng việc) đi thẳng
 * model tương đương thay vì đâm đầu vào cổng hỏng rồi mới chuyển. Bộ nhớ tiến
 * trình là đủ — mất khi deploy chỉ là thử lại sớm hơn.
 */
const NGHI_MS = Math.max(10_000, Number(process.env.CUONGMINI_CONG_NGHI_MS) || 60_000);
const hongToi = new Map<CongModel, number>();

export function baoCongHong(c: CongModel, now = Date.now()): void { hongToi.set(c, now + NGHI_MS); }
export function baoCongOk(c: CongModel): void { hongToi.delete(c); }
export function congDangHong(c: CongModel, now = Date.now()): boolean { return (hongToi.get(c) ?? 0) > now; }

/**
 * Lỗi này có phải CỔNG hỏng (đáng tự chuyển cổng) không — khác lỗi do yêu cầu
 * sai (400 thường: chuyển cổng cũng hỏng y hệt).
 *   5xx · 408/409/429/529 · mất kết nối / hết giờ · hết credit / hết hạn ngạch ·
 *   cổng không có kênh cho model.
 */
export function laLoiCongHong(thong: string, code?: string): boolean {
  if (code && /^CONG_ANTHROPIC_(HET_KEY|HONG)$/.test(code)) return true;
  if (/credit|quota|insufficient|balance|billing|余额|额度|No available channel|unknown provider/i.test(thong)) return true;
  const ma = /HTTP (\d{3})/.exec(thong)?.[1];
  if (ma) return ['408', '409', '429', '529'].includes(ma) || ma.startsWith('5');
  return /aborted|ECONNRESET|ECONNREFUSED|socket hang up|terminated|fetch failed|ETIMEDOUT|timeout|EAI_AGAIN|network/i.test(thong);
}

/** Dòng mờ trong bảng ghi khi đã tự chuyển cổng (song ngữ). */
export function cauDoiCong(ten: string): { vi: string; en: string } {
  return { vi: `Đã chuyển sang ${ten} vì cổng bận`, en: `Switched to ${ten} because the gateway is busy` };
}
