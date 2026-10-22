/**
 * ============================================================
 * CT WORK — CHUỖI CỔNG CỦA TRỢ LÝ AI (22/10/2026)
 * ============================================================
 *
 * Chủ web chốt cho các việc CỐ ĐỊNH của CT Work (work_assistant · work_spec_review · work_digest + ảnh người dùng dán):
 *
 *   1. RAMBO (gói trả trọn ⇒ chi phí biên 0) — Sonnet mới nhất rambo có (`ramboSonic()`: claude-sonnet-5-5 nếu
 *      `/v1/models` có, không thì claude-sonnet-5). Cờ RIÊNG `CTWORK_RAMBO` (mặc định BẬT) — không phụ thuộc công tắc
 *      rambo toàn cục (`ramboBat()`), xem `ctworkDiRambo()` ở gateway.ts.
 *   2. Cổng Anthropic CHÍNH HÃNG ("CuongMini Code Max") — `claude-sonnet-5-5` (work_assistant / spec_review / ảnh),
 *      `claude-haiku-5-5` cho work_digest (việc nhẹ: diễn đạt lại số liệu mã đã tính). Trần $/ngày RIÊNG của CT Work
 *      (`WORK_AI_CHINH_HANG_USD_NGAY`, `…_NGUOI_NGAY`) — chạm trần thì bỏ qua bậc này, không chặn người dùng.
 *   3. modelapi `gpt-6-sol` (lùi CUỐI; nhìn ảnh đúng — đo 27/09).
 *
 * Bậc nào hỏng (410 Key Expired, 401/403, 5xx, hết giờ, mất kết nối, cầu dao đang mở, hết key) ⇒ TỰ sang bậc sau trong
 * CÙNG lượt — người dùng không thấy lỗi. Chữ đã stream của bậc hỏng ⇒ `onRestart` (giao diện xoá nháp). Rambo hỏng ⇒ cầu
 * dao chung (`baoRamboHong`, lỗi khoá nghỉ 10 phút) + mũi dò tự gõ cửa: rambo sống lại (thay khoá mới) ⇒ lượt sau tự về.
 * Cổng chính hãng hỏng ⇒ `baoCongHong('anthropic')` (nghỉ 60 s như AI Code).
 *
 * Không ghi khoá ra log: chỉ ghi mã HTTP / câu lỗi đã có sẵn của adapter (không chứa khoá).
 */

import { AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { ghiSoLlm, httpStatusCua, llmComplete, type LLMMessage, type LLMTool, type LLMToolCall } from '../interview/llm/index.js';
import { checkBudget, budgetMessage } from '../llm/budget.js';
import {
  ctworkDiRambo, fallbackEndpoint, laLoiKhoaRambo, modelDuPhongModelapi, ramboDangNghi, ramboSonic, type LlmEndpoint,
} from '../llm/gateway.js';

export type ViecCtWork = 'work_assistant' | 'work_digest' | 'work_spec_review';
export type CongCtWork = 'rambo' | 'chinh_hang' | 'modelapi';

export interface GoiAiCtWorkOpts {
  /** Bỏ qua — chỉ để nơi gọi cũ (`llmComplete({ step, feature, … })`) đổi sang hàm này mà không sửa thân lời gọi. */
  step?: string;
  feature?: string;
  system: string;
  messages: LLMMessage[];
  maxTokens: number;
  userId: number;
  purpose: ViecCtWork;
  timeoutMs?: number;
  maxRetries?: number;
  onToken?: (delta: string) => void;
  /** Bậc trước đã lỡ phát chữ rồi hỏng ⇒ giao diện xoá nháp trước khi bậc sau phát lại từ đầu. */
  onRestart?: () => void;
  signal?: AbortSignal;
  /** Việc phân tích NẶNG, ít lượt (soát Req, sức khoẻ nhóm, luyện bảo vệ…) ⇒ Opus trên rambo; lùi chính hãng vẫn Sonnet 5.5. */
  nang?: boolean;
  /** 22/10/2026 (aiTraLoi.ts): tool gốc của cổng — trợ lý xin ĐỌC dữ liệu bằng tool call. Cả ba bậc đều nhận. */
  tools?: LLMTool[];
  /**
   * 22/10/2026 — bậc hỏng GIỮA CHỪNG sau khi đã phát chữ: nơi gọi trả bộ tin "viết TIẾP đúng chỗ dở" cho bậc sau (chữ đã
   * hiện giữ nguyên, bậc sau nối vào) thay vì xoá nháp làm lại. Trả `null` (hoặc không truyền) ⇒ như cũ: `onRestart` rồi
   * bậc sau làm lại từ đầu. CHỈ gọi khi đã có chữ tới tay nơi gọi (bậc hỏng TRƯỚC mẩu chữ đầu ⇒ chuyển im lặng).
   */
  noiTiep?: () => LLMMessage[] | null;
  /** Hết giờ CHỜ (không có mẩu nào) theo từng bậc — rambo treo thì chuyển sớm thay vì chờ 90 s. */
  timeoutTheoCong?: Partial<Record<CongCtWork, number>>;
}

export interface KetQuaAiCtWork {
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  biCat?: boolean;
  cong: CongCtWork;
  toolCalls?: LLMToolCall[];
}

// ─── Phụ thuộc (test thay được) ─────────────────────────────────

export interface PhuThuocCong {
  /** Điểm cuối rambo cho CT Work (null = tắt / thiếu cấu hình). */
  rambo: () => LlmEndpoint | null;
  ramboDangNghi: () => boolean;
  goiRambo: (o: GoiAiCtWorkOpts, ep: LlmEndpoint, model: string) => Promise<KetQuaAiCtWork>;
  /** Cổng chính hãng có dùng được không (còn key, không đang nghỉ, trong trần $ ngày của CT Work). */
  chinhHangSanSang: (userId: number) => Promise<boolean>;
  goiChinhHang: (o: GoiAiCtWorkOpts, model: string) => Promise<KetQuaAiCtWork>;
  baoChinhHangHong: () => void;
  goiModelapi: (o: GoiAiCtWorkOpts, model: string) => Promise<KetQuaAiCtWork>;
}

/** Model chính hãng theo việc: digest ⇒ Haiku 5.5 (nhẹ, rẻ); còn lại (kể cả việc Opus trên rambo) ⇒ Sonnet 5.5 — KHÔNG
 *  Opus chính hãng (quá đắt). Env đè được. */
export function modelChinhHangCho(purpose: ViecCtWork): string {
  return purpose === 'work_digest'
    ? process.env.CTWORK_MODEL_CHINH_HANG_NHE?.trim() || 'claude-haiku-5-5'
    : process.env.CTWORK_MODEL_CHINH_HANG?.trim() || 'claude-sonnet-5-5';
}

/**
 * Model trên RAMBO theo việc (chủ web chốt 22/10/2026 — gói trọn nên chọn theo CHẤT LƯỢNG, không theo giá):
 *   work_assistant (chat/thao tác hằng ngày, kể cả stream) ⇒ Sonnet mới nhất rambo có (`ramboSonic()`; hôm nay
 *     `claude-sonnet-5` — /v1/models của rambo chưa có sonnet-5.5);
 *   work_spec_review + việc PHÂN TÍCH NẶNG ít lượt (`nang: true` — soát Req, sức khoẻ nhóm, luyện bảo vệ, rủi ro sprint)
 *     ⇒ `claude-opus-5`;
 *   work_digest ⇒ Sonnet (như assistant).
 * Đè không cần deploy: `LLM_MODEL_<VIỆC>=claude-…` (env model Claude ⇒ áp ở rambo; env model GPT ⇒ áp ở bậc modelapi),
 * việc nặng: `CTWORK_RAMBO_MODEL_NANG`.
 */
export function modelRamboCho(purpose: ViecCtWork = 'work_assistant', nang = false): string {
  const env = process.env[`LLM_MODEL_${purpose.toUpperCase()}`]?.trim();
  if (nang && purpose === 'work_assistant') return process.env.CTWORK_RAMBO_MODEL_NANG?.trim() || 'claude-opus-5';
  if (env && env.startsWith('claude-')) return env;
  if (purpose === 'work_spec_review') return process.env.CTWORK_RAMBO_MODEL_NANG?.trim() || 'claude-opus-5';
  return ramboSonic();
}

/** Model lùi cuối ở modelapi: `LLM_MODEL_<VIỆC>` nếu là model GPT (không gọi Claude qua modelapi — giá ~3,3×), không thì gpt-6-sol. */
export function modelModelapiCho(purpose: ViecCtWork): string {
  const env = process.env[`LLM_MODEL_${purpose.toUpperCase()}`]?.trim();
  return env && !env.startsWith('claude-') ? env : modelDuPhongModelapi();
}

/** Trần $/ngày (giờ VN) của CT Work trên cổng chính hãng — cả web và mỗi người. 0 = không dùng bậc này. */
function soEnv(ten: string, mac: number): number {
  const raw = process.env[ten]?.trim();
  if (!raw) return mac; // để trống (như .env.example) ⇒ mặc định, KHÔNG phải 0
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : mac;
}
const TRAN_TONG = () => soEnv('WORK_AI_CHINH_HANG_USD_NGAY', 30);
const TRAN_NGUOI = () => soEnv('WORK_AI_CHINH_HANG_USD_NGUOI_NGAY', 3);

async function chinhHangSanSangThat(userId: number): Promise<boolean> {
  const tong = TRAN_TONG();
  if (!(tong > 0)) return false;
  const { congDangHong } = await import('../agent/bangModel.js');
  if (congDangHong('anthropic')) return false;
  const { coKeyKhaDung } = await import('../agent/anthropicChinhHang/khoKey.js');
  if (!(await coKeyKhaDung())) return false;
  try {
    const { prisma } = await import('../../config/database.js');
    const { dauNgayVn } = await import('../agent/anthropicChinhHang/hanMuc.js');
    const tu = dauNgayVn();
    const [ca, nguoi] = await Promise.all([
      prisma.anthropicUsage.aggregate({ where: { viec: 'work_ai', createdAt: { gte: tu } }, _sum: { costUsd: true } }),
      prisma.anthropicUsage.aggregate({ where: { viec: 'work_ai', userId, createdAt: { gte: tu } }, _sum: { costUsd: true } }),
    ]);
    if (Number(ca._sum.costUsd ?? 0) >= tong) return false;
    const tranNguoi = TRAN_NGUOI();
    if (tranNguoi > 0 && Number(nguoi._sum.costUsd ?? 0) >= tranNguoi) return false;
  } catch (err) {
    // Sổ hỏng ⇒ KHÔNG dùng bậc trả tiền này (an toàn về tiền) — modelapi vẫn đỡ.
    logger.warn('[ctwork-ai] không đọc được sổ cổng chính hãng — bỏ qua bậc này', { error: (err as Error).message });
    return false;
  }
  return true;
}

/** Ước lượng token (cổng chính hãng trả USD thật, không trả token qua hàm văn bản) — đủ cho trần token/ngày. */
function uocToken(o: GoiAiCtWorkOpts, text: string): { inputTokens: number; outputTokens: number } {
  const vao = o.system.length + o.messages.reduce((n, m) => n + (typeof m.content === 'string' ? m.content.length
    : m.content.reduce((k, b) => k + (b.type === 'text' ? b.text.length : 6000), 0)), 0);
  return { inputTokens: Math.ceil(vao / 4), outputTokens: Math.ceil(text.length / 4) };
}

const THAT: PhuThuocCong = {
  rambo: () => ctworkDiRambo(),
  ramboDangNghi: () => ramboDangNghi(),
  goiRambo: async (o, ep, model) => {
    const r = await llmComplete({
      step: 'report', system: o.system, messages: o.messages, maxTokens: o.maxTokens, userId: o.userId, feature: 'work',
      purpose: o.purpose, timeoutMs: o.timeoutTheoCong?.rambo ?? o.timeoutMs ?? 90_000, maxRetries: 0, diemCuoi: ep, model, khongLui: true,
      ...(o.onToken ? { onToken: o.onToken } : {}), ...(o.onRestart ? { onRestart: o.onRestart } : {}), ...(o.tools?.length ? { tools: o.tools } : {}),
    });
    return { text: r.text, model: r.model, inputTokens: r.inputTokens, outputTokens: r.outputTokens, biCat: r.biCat, cong: 'rambo', ...(r.toolCalls ? { toolCalls: r.toolCalls } : {}) };
  },
  chinhHangSanSang: chinhHangSanSangThat,
  goiChinhHang: async (o, model) => {
    // Trần TIỀN/ngày của cả web vẫn áp (budget.ts) — lượt chính hãng được ghi vào cùng sổ ngay dưới.
    const v = await checkBudget('interactive');
    if (!v.allowed) throw new AppError(budgetMessage(v), 429, 'BUDGET_EXCEEDED');
    const { goiVanBanChinhHang } = await import('../agent/anthropicChinhHang/dinhTuyen.js');
    const ctl = new AbortController();
    const hen = setTimeout(() => ctl.abort(), o.timeoutTheoCong?.chinh_hang ?? o.timeoutMs ?? 90_000);
    const huy = () => ctl.abort();
    o.signal?.addEventListener('abort', huy, { once: true });
    try {
      const r = await goiVanBanChinhHang({
        system: o.system,
        messages: o.messages.map((m) => ({ role: m.role, content: typeof m.content === 'string' ? m.content : (m.content as unknown as Array<Record<string, unknown>>) })),
        model, hang: 'free', maxTokens: o.maxTokens, userId: o.userId, viec: 'work_ai',
        nhanh: { effort: o.purpose === 'work_digest' ? 'low' : 'medium' },
        ...(o.onToken ? { onToken: o.onToken } : {}), signal: ctl.signal, ...(o.tools?.length ? { tools: o.tools } : {}),
      });
      if (!r.text.trim() && !r.toolCalls?.length) throw new Error('chinh_hang: empty reply');
      const tok = uocToken(o, r.text);
      await ghiSoLlm({ userId: o.userId, feature: 'work', step: 'report', model, ...tok, success: true, purpose: o.purpose, costUsd: r.usd, provider: 'anthropic-chinh-hang' }).catch(() => {});
      return { text: r.text, model, ...tok, biCat: r.biCat, cong: 'chinh_hang', ...(r.toolCalls ? { toolCalls: r.toolCalls } : {}) };
    } finally {
      clearTimeout(hen);
      o.signal?.removeEventListener('abort', huy);
    }
  },
  baoChinhHangHong: () => { void import('../agent/bangModel.js').then((m) => m.baoCongHong('anthropic')).catch(() => {}); },
  goiModelapi: async (o, model) => {
    const r = await llmComplete({
      step: 'report', system: o.system, messages: o.messages, maxTokens: o.maxTokens, userId: o.userId, feature: 'work',
      purpose: o.purpose, timeoutMs: o.timeoutTheoCong?.modelapi ?? o.timeoutMs ?? 90_000, maxRetries: o.maxRetries ?? 2, diemCuoi: fallbackEndpoint(model), model,
      ...(o.onToken ? { onToken: o.onToken } : {}), ...(o.onRestart ? { onRestart: o.onRestart } : {}), ...(o.tools?.length ? { tools: o.tools } : {}),
    });
    return { text: r.text, model: r.model, inputTokens: r.inputTokens, outputTokens: r.outputTokens, biCat: r.biCat, cong: 'modelapi', ...(r.toolCalls ? { toolCalls: r.toolCalls } : {}) };
  },
};

let pt: PhuThuocCong = THAT;
/** CHỈ cho test: thay từng phụ thuộc (null = bản thật). */
export function _datCongChoTest(p: Partial<PhuThuocCong> | null): void {
  pt = p ? { ...THAT, ...p } : THAT;
}

/** Lỗi do CHÍNH SÁCH (hết trần tiền của web, người dùng huỷ) ⇒ không lùi tiếp, báo thẳng. */
function laLoiChinhSach(e: unknown): boolean {
  const code = (e as { code?: string })?.code;
  return code === 'BUDGET_EXCEEDED' || code === 'WORK_AI_CANCELLED';
}

/** Một lượt gọi model của CT Work qua chuỗi cổng. Ném lỗi của bậc CUỐI khi mọi bậc đều hỏng. */
export async function goiAiCtWork(o: GoiAiCtWorkOpts): Promise<KetQuaAiCtWork> {
  let daPhat = false;
  const onToken = o.onToken ? (d: string) => { daPhat = true; o.onToken!(d); } : undefined;
  const xoaNhap = () => { if (daPhat) { daPhat = false; o.onRestart?.(); } };
  let opts: GoiAiCtWorkOpts = { ...o, ...(onToken ? { onToken } : {}), onRestart: xoaNhap };
  /**
   * Bậc vừa hỏng. Chưa phát chữ ⇒ bậc sau chạy y nguyên (người dùng không thấy gì). Đã phát chữ ⇒ hỏi nơi gọi bộ tin
   * "viết TIẾP" (`noiTiep`): có ⇒ bậc sau nối tiếp, nháp giữ nguyên; không ⇒ xoá nháp (`onRestart`), bậc sau làm lại.
   */
  const sauKhiHong = () => {
    if (!daPhat) return;
    const tin = o.noiTiep?.() ?? null;
    if (tin && tin.length) { daPhat = false; opts = { ...opts, messages: tin }; return; }
    xoaNhap();
  };
  const huy = () => { if (o.signal?.aborted) throw new AppError('The connection closed before the answer was ready. Ask again.', 499, 'WORK_AI_CANCELLED'); };

  // 1. Rambo
  const ep = pt.rambo();
  if (ep && !pt.ramboDangNghi()) {
    const model = modelRamboCho(o.purpose, o.nang);
    try {
      return await pt.goiRambo(opts, ep, model);
    } catch (e) {
      if (laLoiChinhSach(e)) throw e;
      const st = httpStatusCua(e);
      logger.warn('[ctwork-ai] rambo lỗi — tự chuyển cổng chính hãng', { purpose: o.purpose, status: st ?? null, khoaHong: laLoiKhoaRambo(st), giuaChung: daPhat, error: (e as Error).message?.slice(0, 160) });
      sauKhiHong();
    }
  }
  huy();

  // 2. Cổng Anthropic chính hãng
  if (await pt.chinhHangSanSang(o.userId).catch(() => false)) {
    const model = modelChinhHangCho(o.purpose);
    try {
      return await pt.goiChinhHang(opts, model);
    } catch (e) {
      if (laLoiChinhSach(e)) throw e;
      huy();
      const thong = (e as Error).message ?? '';
      const { laLoiCongHong } = await import('../agent/bangModel.js');
      if (laLoiCongHong(thong, (e as { code?: string }).code)) pt.baoChinhHangHong();
      logger.warn('[ctwork-ai] cổng chính hãng lỗi — lùi modelapi', { purpose: o.purpose, giuaChung: daPhat, error: thong.slice(0, 160) });
      sauKhiHong();
    }
  }
  huy();

  // 3. modelapi (lùi cuối)
  return pt.goiModelapi(opts, modelModelapiCho(o.purpose));
}

/** Tóm tắt chuỗi đang hiệu lực (cho trang admin / báo lỗi) — KHÔNG kèm khoá. */
export function chuoiCongHienTai(purpose: ViecCtWork = 'work_assistant'): Array<{ cong: CongCtWork; model: string; dungDuoc: boolean }> {
  const ep = ctworkDiRambo();
  return [
    { cong: 'rambo', model: modelRamboCho(purpose), dungDuoc: !!ep && !ramboDangNghi() },
    { cong: 'chinh_hang', model: modelChinhHangCho(purpose), dungDuoc: TRAN_TONG() > 0 },
    { cong: 'modelapi', model: modelModelapiCho(purpose), dungDuoc: true },
  ];
}
