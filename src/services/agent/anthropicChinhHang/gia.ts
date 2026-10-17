/**
 * BẢNG GIÁ CHÍNH THỨC của Anthropic — USD / 1 triệu token.
 *
 * Nguồn: bảng "Current Models" trong tài liệu Claude API (bản cache
 * 06/10/2026) + mục Prompt caching: ghi đệm 5 phút = ×1,25 giá vào, đọc đệm =
 * ×0,1 giá vào — RIÊNG Fable 5.1 đọc đệm $0,25 (×0,025), Opus 5.5 đọc $0,20
 * (×0,05). Haiku 5.5: $0,10/$0,50 cho prompt ≤ 100K token, $0,50/$2,50 khi dài hơn.
 *
 * Giá đổi thì đặt env, KHÔNG phải sửa mã:
 *   ANTHROPIC_CHINH_HANG_GIA='{"claude-sonnet-5-5":{"in":2,"out":10,"cacheDoc":0.2,"cacheGhi":2.5}}'
 * (trường thiếu giữ giá trong bảng).
 *
 * ⚠️ Đây là số TỰ TÍNH từ `usage` Anthropic trả về, không phải hoá đơn. Key
 * thường không đọc được số dư thật — chỉ Admin API key mới đối chiếu được
 * (`doiChieu.ts`).
 */

export interface GiaModel {
  in: number;
  out: number;
  cacheDoc: number;
  cacheGhi: number;
  /** Bậc giá khi prompt (vào + đọc đệm + ghi đệm) vượt `nguong` token. */
  dai?: { nguong: number; in: number; out: number; cacheDoc: number; cacheGhi: number };
}

const g = (vao: number, ra: number, cacheDoc = vao * 0.1): GiaModel => ({ in: vao, out: ra, cacheDoc, cacheGhi: vao * 1.25 });

export const BANG_GIA: Record<string, GiaModel> = {
  'claude-fable-5-1': g(10, 50, 0.25),
  'claude-fable-5': g(10, 50),
  'claude-opus-5-5': g(4, 20, 0.2),
  'claude-opus-5': g(5, 25),
  'claude-opus-4-8': g(5, 25),
  'claude-opus-4-7': g(5, 25),
  'claude-opus-4-6': g(5, 25),
  'claude-sonnet-5-5': g(2, 10, 0.2),
  'claude-sonnet-5': g(2, 10),
  'claude-sonnet-4-6': g(3, 15),
  'claude-haiku-5-5': { ...g(0.1, 0.5), dai: { nguong: 100_000, ...g(0.5, 2.5) } },
  'claude-haiku-4-5': g(1, 5),
};

/** Model lạ ⇒ giá Opus (đắt) để không bao giờ đếm thiếu. */
const GIA_MO = g(5, 25);

export function giaCua(model: string): GiaModel {
  const goc = BANG_GIA[model] ?? GIA_MO;
  const raw = process.env.ANTHROPIC_CHINH_HANG_GIA;
  if (!raw) return goc;
  try {
    const dat = (JSON.parse(raw) as Record<string, Partial<GiaModel>>)[model];
    if (!dat || typeof dat !== 'object') return goc;
    const so = (v: unknown, mac: number) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : mac);
    return {
      in: so(dat.in, goc.in),
      out: so(dat.out, goc.out),
      cacheDoc: so(dat.cacheDoc, goc.cacheDoc),
      cacheGhi: so(dat.cacheGhi, goc.cacheGhi),
      ...(goc.dai ? { dai: goc.dai } : {}),
    };
  } catch {
    return goc;
  }
}

export interface DungToken {
  /** `usage.input_tokens` — phần KHÔNG qua đệm (Anthropic tách riêng hai phần đệm). */
  input: number;
  output: number;
  cacheDoc: number;
  cacheGhi: number;
  /** Token của lượt COMPACT phía máy chủ (`usage.iterations[type=compaction]`) — top-level KHÔNG gồm phần này. */
  nenVao?: number;
  nenRa?: number;
  /** Số lần tìm web của server tool (`usage.server_tool_use.web_search_requests`). */
  timWeb?: number;
}

/** USD mỗi lần tìm web (giá chính thức $10 / 1.000 lần). Đổi bằng `ANTHROPIC_CHINH_HANG_GIA_TIM_WEB`. */
export function giaTimWeb(): number {
  const n = Number(process.env.ANTHROPIC_CHINH_HANG_GIA_TIM_WEB);
  return Number.isFinite(n) && n >= 0 && process.env.ANTHROPIC_CHINH_HANG_GIA_TIM_WEB !== undefined ? n : 0.01;
}

/** USD của một lời gọi. */
export function tinhUsd(model: string, u: DungToken): number {
  const goc = giaCua(model);
  const prompt = u.input + u.cacheDoc + u.cacheGhi;
  const p = goc.dai && prompt > goc.dai.nguong ? goc.dai : goc;
  const usd = (u.input * p.in + u.output * p.out + u.cacheDoc * p.cacheDoc + u.cacheGhi * p.cacheGhi
    + (u.nenVao ?? 0) * goc.in + (u.nenRa ?? 0) * goc.out) / 1_000_000
    + (u.timWeb ?? 0) * giaTimWeb();
  return Math.round(usd * 1e6) / 1e6;
}
