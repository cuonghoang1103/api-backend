/**
 * ============================================================
 * CT LỒNG TIẾNG — CHUỖI CỔNG DỊCH (18/11/2026, chủ kênh chốt 12:10)
 * ============================================================
 *
 * Trạm (máy nhà) gọi `POST /internal/long-tieng/dich` + `/tu-dien`; backend dịch bằng Claude theo chuỗi, tự chuyển bậc
 * trong CÙNG yêu cầu khi lỗi / hết giờ / trả rỗng / JSON hỏng:
 *
 *   1. gwai — cổng Claude rẻ (`GWAI_BASE_URL` + `GWAI_API_KEY`, tuyến Anthropic `/v1/messages`; trong mã đi qua ống "rambo"
 *      cũ: `congRamboCauHinh()` + cầu dao `ramboDangNghi/baoRamboHong`). Model `claude-sonnet-5-5` (`LONG_TIENG_GWAI_MODEL`).
 *      Cờ riêng `LONG_TIENG_GWAI` (mặc định BẬT; `0` tắt) — không phụ thuộc công tắc rambo toàn cục. rambo.ai THẬT đã chết,
 *      không bao giờ gọi (`AGENT_GATEWAY_*` chỉ còn là tên cũ của cùng ống — prod đặt `GWAI_*`).
 *   2. Anthropic CHÍNH HÃNG `claude-sonnet-5-5` (`LONG_TIENG_MODEL_CHINH_HANG`) — trần RIÊNG `LONG_TIENG_CHINH_HANG_USD_NGAY`
 *      (mặc định 10 $/ngày giờ VN, 0 = bỏ bậc này), sổ `anthropic_usage.viec = 'long_tieng_dich'`. Trần tiền cả web
 *      (`budget.ts`) vẫn áp.
 *   3. modelapi `gpt-6-sol` (`LLM_MODEL_LONG_TIENG_DICH=gpt-…` đè) — lùi cuối.
 *
 * Structured outputs: hai bậc Claude gửi `output_config.format = { type: 'json_schema', schema }` (KHÔNG prefill — Sonnet 5.5
 * từ chối; KHÔNG temperature). gwai trả 400 khi kèm tham số đó ⇒ gửi lại MỘT lần không kèm (prompt vẫn đòi JSON). Bậc nào
 * trả JSON không qua `kiem` ⇒ coi như hỏng, sang bậc sau. Mỗi lượt ghi log `[lt-dich]` kèm bậc đã phục vụ. Không ghi khoá.
 */
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { httpStatusCua, llmComplete } from './interview/llm/index.js';
import { checkBudget, budgetMessage } from './llm/budget.js';
import { baoRamboHong, baoRamboOk, congRamboCauHinh, fallbackEndpoint, laLoiKhoaRambo, modelDuPhongModelapi, ramboDangNghi, type LlmEndpoint } from './llm/gateway.js';
import { tachJson } from './voVietLai.service.js';
import { laCauLoiCong } from './work/aiCong.js';

export type BacDich = 'gwai' | 'chinh_hang' | 'modelapi';
export const CHUOI_DICH: readonly BacDich[] = ['gwai', 'chinh_hang', 'modelapi'];
const VIEC = 'long_tieng_dich' as const;

export interface GoiDichOpts {
  system: string;
  user: string;
  /** JSON schema của câu trả lời (structured outputs). */
  schema: Record<string, unknown>;
  maxTokens: number;
  userId: number;
  /** Nhãn log: 'lo' (một lô câu) | 'tu-dien' | … */
  nhan: string;
  jobId?: string;
  timeoutMs?: number;
}
export interface TraLoiCong { text: string; model: string }

export interface PhuThuocDich {
  gwai: () => LlmEndpoint | null;
  gwaiDangNghi: () => boolean;
  goiGwai: (o: GoiDichOpts, ep: LlmEndpoint, model: string, coDinhDang: boolean) => Promise<TraLoiCong>;
  baoGwai: (ok: boolean, khoaHong?: boolean) => void;
  chinhHangSanSang: () => Promise<boolean>;
  goiChinhHang: (o: GoiDichOpts, model: string) => Promise<TraLoiCong>;
  baoChinhHangHong: () => void;
  goiModelapi: (o: GoiDichOpts, model: string) => Promise<TraLoiCong>;
}

// ─── Cấu hình (THUẦN — test đọc) ───────────────────────────────

export function gwaiChoDich(): LlmEndpoint | null {
  const env = process.env.LONG_TIENG_GWAI?.trim();
  if (env === '0' || env === 'false') return null;
  return congRamboCauHinh();
}
export const modelGwaiDich = () => process.env.LONG_TIENG_GWAI_MODEL?.trim() || 'claude-sonnet-5-5';
export const modelChinhHangDich = () => process.env.LONG_TIENG_MODEL_CHINH_HANG?.trim() || 'claude-sonnet-5-5';
export function modelModelapiDich(): string {
  const env = process.env.LLM_MODEL_LONG_TIENG_DICH?.trim();
  return env && !env.startsWith('claude-') ? env : modelDuPhongModelapi();
}
/** Trần $/ngày (giờ VN) của việc dịch trên cổng chính hãng. Để trống ⇒ 10; 0 ⇒ không dùng bậc này. */
export function tranChinhHangDich(): number {
  const raw = process.env.LONG_TIENG_CHINH_HANG_USD_NGAY?.trim();
  if (!raw) return 10;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 10;
}

/** Hôm nay (giờ VN) việc dịch đã tiêu ở cổng chính hãng còn dưới trần không — đọc sổ `anthropic_usage`. */
export async function trongTranChinhHangDich(): Promise<boolean> {
  const tran = tranChinhHangDich();
  if (!(tran > 0)) return false;
  try {
    const { prisma } = await import('../config/database.js');
    const { dauNgayVn } = await import('./agent/anthropicChinhHang/hanMuc.js');
    const r = await prisma.anthropicUsage.aggregate({ where: { viec: VIEC, createdAt: { gte: dauNgayVn() } }, _sum: { costUsd: true } });
    return Number(r._sum.costUsd ?? 0) < tran;
  } catch (err) {
    // Sổ hỏng ⇒ KHÔNG dùng bậc trả tiền (an toàn về tiền) — modelapi vẫn đỡ.
    logger.warn('[lt-dich] không đọc được sổ cổng chính hãng — bỏ qua bậc này', { error: (err as Error).message });
    return false;
  }
}

async function chinhHangSanSangThat(): Promise<boolean> {
  if (!(tranChinhHangDich() > 0)) return false;
  const { congDangHong } = await import('./agent/bangModel.js');
  if (congDangHong('anthropic')) return false;
  const { coKeyKhaDung } = await import('./agent/anthropicChinhHang/khoKey.js');
  if (!(await coKeyKhaDung())) return false;
  return trongTranChinhHangDich();
}

const THAT: PhuThuocDich = {
  gwai: gwaiChoDich,
  gwaiDangNghi: ramboDangNghi,
  goiGwai: async (o, ep, model, coDinhDang) => {
    const r = await llmComplete({
      step: 'generation', feature: 'creator', purpose: VIEC, userId: o.userId, system: o.system,
      messages: [{ role: 'user', content: o.user }], maxTokens: o.maxTokens, timeoutMs: o.timeoutMs ?? 150_000, maxRetries: 0,
      diemCuoi: ep, model, khongLui: true, ...(coDinhDang ? { dinhDangJson: o.schema } : {}),
    });
    return { text: r.text, model: r.model };
  },
  baoGwai: (ok, khoaHong) => { if (ok) baoRamboOk(); else baoRamboHong({ khoaHong }); },
  chinhHangSanSang: chinhHangSanSangThat,
  goiChinhHang: async (o, model) => {
    const v = await checkBudget('interactive');
    if (!v.allowed) throw new AppError(budgetMessage(v), 429, 'BUDGET_EXCEEDED');
    const { goiVanBanChinhHang } = await import('./agent/anthropicChinhHang/dinhTuyen.js');
    const { ghiSoLlm } = await import('./interview/llm/index.js');
    const ctl = new AbortController();
    const hen = setTimeout(() => ctl.abort(), Math.max(o.timeoutMs ?? 150_000, 90_000));
    try {
      const r = await goiVanBanChinhHang({
        system: o.system, messages: [{ role: 'user', content: o.user }], model, hang: 'free', maxTokens: o.maxTokens,
        userId: o.userId, viec: VIEC, nhanh: { effort: 'medium' }, signal: ctl.signal, dinhDangJson: o.schema,
      });
      const tok = { inputTokens: Math.ceil((o.system.length + o.user.length) / 4), outputTokens: Math.ceil(r.text.length / 4) };
      await ghiSoLlm({ userId: o.userId, feature: 'creator', step: 'generation', model, ...tok, success: true, purpose: VIEC, costUsd: r.usd, provider: 'anthropic-chinh-hang' }).catch(() => {});
      return { text: r.text, model };
    } finally {
      clearTimeout(hen);
    }
  },
  baoChinhHangHong: () => { void import('./agent/bangModel.js').then((m) => m.baoCongHong('anthropic')).catch(() => {}); },
  goiModelapi: async (o, model) => {
    const r = await llmComplete({
      step: 'generation', feature: 'creator', purpose: VIEC, userId: o.userId, system: o.system,
      messages: [{ role: 'user', content: o.user }], maxTokens: o.maxTokens, timeoutMs: o.timeoutMs ?? 150_000, maxRetries: 1,
      diemCuoi: fallbackEndpoint(model), model,
    });
    return { text: r.text, model: r.model };
  },
};

let pt: PhuThuocDich = THAT;
/** CHỈ cho test: thay từng phụ thuộc (null = bản thật). Test KHÔNG BAO GIỜ gọi cổng thật. */
export function _datCongDichChoTest(p: Partial<PhuThuocDich> | null): void { pt = p ? { ...THAT, ...p } : THAT; }

/** Mã HTTP của lỗi cổng (LLMError của llmComplete, hoặc lỗi mang `httpStatus`). */
const maHttp = (e: unknown): number | undefined => httpStatusCua(e) ?? (e as { httpStatus?: number } | null)?.httpStatus;
const laLoiChinhSach = (e: unknown) => (e as { code?: string })?.code === 'BUDGET_EXCEEDED';

/**
 * Một lượt dịch / soạn từ điển qua chuỗi cổng. `kiem` nhận JSON đã tách, trả kết quả hợp lệ hoặc null (⇒ bậc sau).
 * Ném lỗi của bậc CUỐI khi mọi bậc hỏng.
 */
export async function goiChuoiDich<T>(o: GoiDichOpts, kiem: (json: Record<string, unknown>) => T | null): Promise<{ ketQua: T; bac: BacDich; model: string }> {
  let loiCuoi: unknown = null;
  for (let i = 0; i < CHUOI_DICH.length; i++) {
    const bac = CHUOI_DICH[i]!;
    const cuoi = i === CHUOI_DICH.length - 1;
    let model = '';
    try {
      let r: TraLoiCong;
      if (bac === 'gwai') {
        const ep = pt.gwai();
        if (!ep || pt.gwaiDangNghi()) continue;
        model = modelGwaiDich();
        try {
          r = await pt.goiGwai(o, ep, model, true);
        } catch (e) {
          if (maHttp(e) !== 400) throw e;
          // Cổng không nhận `output_config.format` ⇒ gửi lại một lần chỉ bằng lời dặn trong prompt.
          r = await pt.goiGwai(o, ep, model, false);
        }
      } else if (bac === 'chinh_hang') {
        if (!(await pt.chinhHangSanSang().catch(() => false))) continue;
        model = modelChinhHangDich();
        r = await pt.goiChinhHang(o, model);
      } else {
        model = modelModelapiDich();
        r = await pt.goiModelapi(o, model);
      }
      const text = (r.text ?? '').trim();
      if (!text) throw new Error(`${bac}: trả rỗng`);
      if (laCauLoiCong(text)) throw new Error(`${bac}: cổng trả câu báo lỗi — ${text.slice(0, 120)}`);
      const json = tachJson(text);
      if (!json) throw Object.assign(new Error(`${bac}: JSON hỏng`), { code: 'LT_JSON_HONG' });
      const ketQua = kiem(json);
      if (ketQua == null) throw Object.assign(new Error(`${bac}: JSON sai khuôn`), { code: 'LT_JSON_HONG' });
      if (bac === 'gwai') pt.baoGwai(true);
      logger.info('[lt-dich] đã phục vụ', { bac, model: r.model || model, nhan: o.nhan, jobId: o.jobId ?? null });
      return { ketQua, bac, model: r.model || model };
    } catch (e) {
      if (laLoiChinhSach(e)) throw e;
      loiCuoi = e;
      const thong = (e as Error).message ?? '';
      const st = maHttp(e);
      // JSON hỏng không phải lỗi CỔNG ⇒ không ngắt cầu dao.
      if (bac === 'gwai' && (e as { code?: string }).code !== 'LT_JSON_HONG') pt.baoGwai(false, laLoiKhoaRambo(st));
      if (bac === 'chinh_hang') {
        const { laLoiCongHong } = await import('./agent/bangModel.js');
        if (laLoiCongHong(thong, (e as { code?: string }).code)) pt.baoChinhHangHong();
      }
      logger.warn(`[lt-dich] ${bac} lỗi — tự chuyển bậc sau`, {
        model, bacSau: cuoi ? null : CHUOI_DICH[i + 1], status: st ?? null, nhan: o.nhan, jobId: o.jobId ?? null, error: thong.slice(0, 160),
      });
      if (cuoi) break;
    }
  }
  throw loiCuoi ?? new AppError('Không cổng dịch nào dùng được — thử lại sau ít phút.', 503, 'LT_DICH_KHONG_CONG');
}

/** Tóm tắt chuỗi đang hiệu lực — KHÔNG kèm khoá. */
export function chuoiDichHienTai(): Array<{ bac: BacDich; model: string; dungDuoc: boolean }> {
  return [
    { bac: 'gwai', model: modelGwaiDich(), dungDuoc: !!gwaiChoDich() && !ramboDangNghi() },
    { bac: 'chinh_hang', model: modelChinhHangDich(), dungDuoc: tranChinhHangDich() > 0 },
    { bac: 'modelapi', model: modelModelapiDich(), dungDuoc: true },
  ];
}
