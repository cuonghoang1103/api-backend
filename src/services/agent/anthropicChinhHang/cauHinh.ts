/**
 * ============================================================
 * CỔNG CLAUDE CHÍNH HÃNG — cấu hình chung (17/10/2026)
 * ============================================================
 *
 * Gọi THẲNG `api.anthropic.com` bằng key của chủ app (hai key, mỗi key có
 * credit ưu đãi hằng tháng). Hai vai:
 *
 *  1. **CuongMini Free** — rambo hỏng ⇒ AI Code / CuongMini TỰ chuyển sang
 *     model RẺ NHẤT của cổng này (mặc định `claude-haiku-5-5`), không cần mật
 *     khẩu. Vẫn tính vào trần "free" theo gói/người (`hanMuc.ts`).
 *  2. **Model cao** (Fable 5.1 / Opus 5.5 / Sonnet 5.5) — cần mật khẩu riêng
 *     của cổng này ⇒ vé 30 ngày (`ve.ts`). Admin không cần vé, không bị trần.
 *
 * Hợp đồng API cho client: `docs/cong-anthropic-chinh-hang.md`.
 *
 * ⚠️ Model id và giá lấy từ tài liệu chính thức của Anthropic (bảng "Current
 * Models", cache 06/10/2026) — xem `gia.ts`. Đo thật 17/10/2026: `GET
 * /v1/models` trả 200 với cả hai key và liệt kê đủ bốn model dưới đây; chữ
 * đầu tiên haiku-5-5 1,3s, sonnet-5-5 1,8s. Hai model đó MẶC ĐỊNH nghĩ trước
 * khi viết (khối `thinking` rỗng chữ) — bộ đọc luồng ở `turn.ts` bỏ qua khối đó.
 */

import { bangModel, hangSo, laMaCuongMini, timModel } from '../bangModel.js';

/** Gốc API, KHÔNG kèm `/v1`. Đổi được để test trỏ vào máy chủ giả trên 127.0.0.1. */
export function gocChinhHang(): string {
  const goc = (process.env.ANTHROPIC_CHINH_HANG_BASE_URL?.trim() || 'https://api.anthropic.com').replace(/\/+$/, '');
  /* Chốt an toàn: lúc chạy test mà vẫn trỏ api.anthropic.com thật ⇒ ném ngay
     (cùng tinh thần dây bẫy R2 trong CLAUDE.md). Test không bao giờ được tốn
     credit thật. */
  const dangTest = process.env.NODE_ENV === 'test' || process.env.WORK_DB_TEST === '1'
    || Boolean(process.env.NODE_TEST_CONTEXT);
  let host = '';
  try { host = new URL(goc).host; } catch { throw new Error(`ANTHROPIC_CHINH_HANG_BASE_URL không phải URL hợp lệ: ${goc.slice(0, 80)}`); }
  if (dangTest && /(^|\.)anthropic\.com(:\d+)?$/i.test(host)) {
    throw new Error('Đang chạy test mà cổng chính hãng trỏ api.anthropic.com thật — đặt ANTHROPIC_CHINH_HANG_BASE_URL về máy chủ giả.');
  }
  return goc;
}

export const PHIEN_BAN_API = '2023-06-01';

/**
 * Model CuongMini Free — một chỗ duy nhất, đổi bằng env không sửa mã.
 * Mặc định model RẺ NHẤT của cổng: `claude-haiku-5-5` ($0,10 / $0,50 mỗi triệu token).
 */
export function modelFree(): string {
  return process.env.ANTHROPIC_CHINH_HANG_MODEL_FREE?.trim() || 'claude-haiku-5-5';
}

export type HangChinhHang = 'free' | 'cao';

export interface ModelChinhHang {
  /** Mã app gửi lên (`model` trong thân `/agent/turn`). */
  id: string;
  /** Tên thật gửi Anthropic. */
  model: string;
  ten: string;
  mo: string;
  hang: HangChinhHang;
  /** Model đắt bất thường ⇒ app cảnh báo trước khi dùng. */
  dat?: boolean;
}

/**
 * 18/10/2026: model của cổng này nay sống trong BẢNG CHUNG `../bangModel.ts`
 * (tên CuongMini, khoá, trần, thứ tự). Hàm dưới chỉ lọc phần `cong: 'anthropic'`
 * để mã cũ (admin, exam tutor) còn chạy. Mã cũ `cl-*` vẫn hiểu qua bí danh.
 */
export const MA_FREE = 'cm-heshin';

export function dsModelChinhHangGoc(): ModelChinhHang[] {
  return bangModel()
    .filter((m) => m.cong === 'anthropic')
    .map((m) => ({ id: m.id, model: m.model, ten: m.ten, mo: m.mo, hang: hangSo(m), ...(m.dat ? { dat: true } : {}) }));
}

export function laMaChinhHang(id: unknown): id is string {
  return laMaCuongMini(id) && timModel(id).cong === 'anthropic';
}

/** Mã app gửi ⇒ model chính hãng. `null` = không phải mã của cổng này. */
export function modelChinhHangTu(id: unknown): ModelChinhHang | null {
  if (!laMaChinhHang(id)) return null;
  const ma = timModel(id).id;
  return dsModelChinhHangGoc().find((m) => m.id === ma) ?? null;
}

/**
 * Model rambo ⇒ model chính hãng TƯƠNG ĐƯƠNG (dùng cho CuongMini trong thi
 * khi người dùng có vé model cao). Đổi bằng `ANTHROPIC_CHINH_HANG_MAP` (JSON).
 */
export function modelTuongDuong(modelRambo: string): string {
  try {
    const dat = JSON.parse(process.env.ANTHROPIC_CHINH_HANG_MAP || '{}') as Record<string, string>;
    if (typeof dat[modelRambo] === 'string') return dat[modelRambo]!;
  } catch { /* JSON hỏng ⇒ dùng bảng mặc định */ }
  if (/haiku/i.test(modelRambo)) return 'claude-haiku-5-5';
  if (/opus/i.test(modelRambo)) return 'claude-opus-5-5';
  if (/fable/i.test(modelRambo)) return 'claude-fable-5-1';
  return 'claude-sonnet-5-5';
}

export type MucEffort = 'low' | 'medium' | 'high' | 'xhigh' | 'max';
const DS_EFFORT: MucEffort[] = ['low', 'medium', 'high', 'xhigh', 'max'];

/**
 * `output_config.effort` theo ĐÚNG mức nỗ lực người dùng chọn ở AI Code
 * (CHẤT LƯỢNG TRƯỚC — 17/10/2026: không bao giờ tự hạ effort để tiết kiệm):
 *   thap→low · vua→medium · cao→high · ratCao→xhigh · toiDa/ultracode→max.
 * Không chọn (app cũ, CuongMini trong thi) ⇒ mặc định của cổng = `high`
 * (đổi bằng `ANTHROPIC_CHINH_HANG_EFFORT`). Lưu ý Opus 5.5 / Haiku 5.5 tự mặc
 * định `medium` nếu không gửi — nên LUÔN gửi.
 */
export function effortTheoMuc(muc?: unknown): MucEffort {
  const bang: Record<string, MucEffort> = {
    thap: 'low', vua: 'medium', cao: 'high', ratCao: 'xhigh', toiDa: 'max', ultracode: 'max',
  };
  if (typeof muc === 'string' && bang[muc]) return bang[muc]!;
  const env = process.env.ANTHROPIC_CHINH_HANG_EFFORT?.trim() as MucEffort | undefined;
  return env && DS_EFFORT.includes(env) ? env : 'high';
}

/** Trần token RA cho lượt agent — RỘNG, không cắt câu trả lời (thinking cũng tính vào đây). */
export function maxTokensAgent(): number {
  const n = Number(process.env.ANTHROPIC_CHINH_HANG_MAX_TOKENS);
  /* 18/10/2026: 64.000 → 128.000 (= trần thật của cả 4 model, đo `/v1/models`). Đây là TRẦN, không
     phải chỉ tiêu — model chỉ viết thứ nó cần; thinking cũng ăn vào đây nên trần thấp là cắt cụt. */
  return Number.isFinite(n) && n >= 4096 ? Math.min(128_000, Math.floor(n)) : 128_000;
}

/**
 * Dọn ngữ cảnh PHÍA MÁY CHỦ Anthropic — ưu tiên COMPACT (tóm tắt) hơn xoá kết
 * quả tool. Ngưỡng tính bằng token VÀO (cửa sổ 1M):
 *   compact_20260112   — ANTHROPIC_CHINH_HANG_COMPACT_TOKENS (mặc định 300.000; tối thiểu 50.000; 0 = tắt)
 *   clear_tool_uses    — chỉ khi RẤT lớn: 600.000 token, giữ 25 kết quả gần nhất, mỗi lần dọn ≥ 50.000
 *   clear_thinking     — giữ TẤT CẢ (xoá thinking làm trượt đệm; chỉ có để khai báo rõ)
 */
export function nguongCompact(): number {
  const raw = process.env.ANTHROPIC_CHINH_HANG_COMPACT_TOKENS;
  if (raw === '0') return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 50_000 ? Math.floor(n) : 300_000;
}
export const DON_TOOL = { trigger: 600_000, keep: 25, clearAtLeast: 50_000 } as const;

export const BETA_CONTEXT_MANAGEMENT = 'context-management-2025-06-27';
export const BETA_COMPACT = 'compact-2026-01-12';
/** Cho phép `thinking.block_binding.prefix_mismatch_behavior: "drop_block"`. */
export const BETA_THINKING_BINDING = 'thinking-binding-controls-2026-08-01';

/**
 * Trần KÝ TỰ cho cả hội thoại khi người dùng CHỌN TAY model chính hãng (cửa sổ
 * 1M token). 2.400.000 ký tự ≈ 600–700K token ≈ 60–70% cửa sổ; quá nữa thì
 * compact phía máy chủ đã chạy từ lâu. Đường rambo/modelapi giữ 600.000.
 */
export const TRAN_KY_TU_CHINH_HANG = 2_400_000;

/**
 * Lùi phía máy chủ khi model TỪ CHỐI vì bộ lọc an toàn (`stop_reason:
 * refusal`) — Anthropic khuyên bật mặc định cho Opus 5.5 / Sonnet 5.5 / Fable
 * 5.1. Haiku 5.5 không hỗ trợ. Tắt bằng `ANTHROPIC_CHINH_HANG_FALLBACKS=false`.
 */
export function dungFallbacks(model: string): boolean {
  if (process.env.ANTHROPIC_CHINH_HANG_FALLBACKS === 'false') return false;
  return ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-fable-5-1'].includes(model);
}
export const BETA_FALLBACKS = 'server-side-fallback-2026-07-01';
