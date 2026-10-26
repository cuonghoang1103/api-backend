/**
 * ============================================================
 * CT WORK — CHUỖI CỔNG CỦA TRỢ LÝ AI (22/10/2026, sửa lần 2 cùng ngày)
 * ============================================================
 *
 * Chủ web chốt cho các việc CỐ ĐỊNH của CT Work (work_assistant · work_spec_review · work_digest + ảnh người dùng dán).
 * Thứ tự MẶC ĐỊNH (đổi không cần sửa mã: `CTWORK_CHUOI_CONG=rambo,chinh_hang_sonnet,chinh_hang_haiku,modelapi`):
 *
 *   1. RAMBO (gói trả trọn ⇒ chi phí biên 0) — trợ lý: `claude-fable-5` (đo prod 22/10: gọi tool đúng 3/3, ~3–7 s;
 *      `CTWORK_RAMBO_MODEL` đè); việc nặng + spec_review: `claude-opus-5` (`CTWORK_RAMBO_MODEL_NANG`); digest: Sonnet.
 *      `/v1/models` của rambo không có model đã chọn ⇒ Sonnet mới nhất nó có (`ramboSonic()`, hôm nay claude-sonnet-5).
 *      Cờ RIÊNG `CTWORK_RAMBO` (mặc định BẬT), xem `ctworkDiRambo()` ở gateway.ts.
 *   2. Anthropic CHÍNH HÃNG Sonnet 5.5 (`CTWORK_MODEL_CHINH_HANG`; digest: Haiku 5.5) — trần $/ngày RIÊNG của CT Work
 *      `WORK_AI_CHINH_HANG_USD_NGAY` (100) / `…_NGUOI_NGAY` (10). Chỉ cắn khi rambo hỏng.
 *   3. Chính hãng Haiku 5.5 (`CTWORK_MODEL_CHINH_HANG_DU_PHONG`) — khi Sonnet hỏng HOẶC đã chạm trần trên: Haiku được
 *      thêm một khoản trần NHỎ chồng lên (`WORK_AI_CHINH_HANG_HAIKU_USD_NGAY` 20 / `…_HAIKU_USD_NGUOI_NGAY` 2) ⇒ người
 *      dùng hết trần Sonnet vẫn còn câu trả lời rẻ, tổng tiền chính hãng/ngày vẫn có trần cứng (120 $ / 12 $ mỗi người).
 *   4. modelapi `gpt-6-sol` (lùi CUỐI; nhìn ảnh đúng — đo 27/09).
 *
 * Bậc nào hỏng (DNS/mất kết nối, 410/401/403, 5xx, hết giờ, trả rỗng, trả câu báo lỗi của cổng — "Verify your email…",
 * cầu dao đang mở, hết key, hết trần) ⇒ TỰ sang bậc sau trong CÙNG lượt — người dùng không thấy lỗi. Hỏng sau khi đã
 * phát chữ ⇒ bậc sau VIẾT TIẾP (`noiTiep`). Rambo hỏng ⇒ cầu dao chung (`baoRamboHong`, lỗi khoá nghỉ 10 phút) + mũi dò
 * tự gõ cửa. Cổng chính hãng hỏng ⇒ `baoCongHong('anthropic')` (nghỉ 60 s) — báo SAU khi đã thử cả Haiku.
 * Model trả markup gọi tool dạng chữ (DSML…) ⇒ nơi gọi bỏ qua cổng đó ở lần làm lại (`boQuaCong`, aiMarkupTool.ts).
 *
 * Không ghi khoá ra log: chỉ ghi mã HTTP / câu lỗi đã có sẵn của adapter (không chứa khoá).
 */

import { AppError } from '../../middleware/errorHandler.js';
import { MA_LOI_CHAN, biChanCuongMini, cauBiChan } from '../agent/cuongMiniChan.js';
import { logger } from '../../utils/logger.js';
import { ghiSoLlm, httpStatusCua, llmComplete, type LLMMessage, type LLMTool, type LLMToolCall } from '../interview/llm/index.js';
import { checkBudget, budgetMessage } from '../llm/budget.js';
import {
  ctworkDiRambo, docDsModelRamboDaNho, fallbackEndpoint, laLoiKhoaRambo, modelDuPhongModelapi, ramboDangNghi, ramboSonic, type LlmEndpoint,
} from '../llm/gateway.js';

export type ViecCtWork = 'work_assistant' | 'work_digest' | 'work_spec_review';
export type CongCtWork = 'rambo' | 'chinh_hang' | 'modelapi';
/** Một BẬC của chuỗi (cổng chính hãng có hai bậc: Sonnet rồi Haiku). */
export type BacCtWork = 'rambo' | 'chinh_hang_sonnet' | 'chinh_hang_haiku' | 'modelapi';
export const CHUOI_MAC_DINH: readonly BacCtWork[] = ['rambo', 'chinh_hang_sonnet', 'chinh_hang_haiku', 'modelapi'];
const congCuaBac = (b: BacCtWork): CongCtWork => (b === 'rambo' ? 'rambo' : b === 'modelapi' ? 'modelapi' : 'chinh_hang');

/**
 * Thứ tự bậc đang hiệu lực: `CTWORK_CHUOI_CONG` (phẩy ngăn cách; `chinh_hang` = `chinh_hang_sonnet`; tên lạ bị bỏ,
 * trùng bị bỏ), rỗng/không hợp lệ ⇒ CHUOI_MAC_DINH. Tôn trọng đúng danh sách người cấu hình (không tự thêm bậc).
 */
export function chuoiCtWork(): BacCtWork[] {
  const raw = process.env.CTWORK_CHUOI_CONG?.trim();
  if (!raw) return [...CHUOI_MAC_DINH];
  const ra: BacCtWork[] = [];
  for (const t of raw.split(',').map((x) => x.trim().toLowerCase())) {
    const b = (t === 'chinh_hang' ? 'chinh_hang_sonnet' : t) as BacCtWork;
    if (CHUOI_MAC_DINH.includes(b) && !ra.includes(b)) ra.push(b);
  }
  return ra.length ? ra : [...CHUOI_MAC_DINH];
}

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
  /**
   * 22/10/2026: bỏ qua các bậc này ở lượt này (bậc đó vừa trả markup gọi tool dạng chữ — aiMarkupTool.ts). modelapi là
   * lùi cuối nên KHÔNG BAO GIỜ bị bỏ (có trong danh sách cũng vẫn gọi).
   */
  boQuaCong?: CongCtWork[];
}

export interface KetQuaAiCtWork {
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  biCat?: boolean;
  cong: CongCtWork;
  toolCalls?: LLMToolCall[];
  /** Bậc đã trả lời (cổng chính hãng có hai bậc). */
  bac?: BacCtWork;
}

// ─── Phụ thuộc (test thay được) ─────────────────────────────────

export interface PhuThuocCong {
  /** Điểm cuối rambo cho CT Work (null = tắt / thiếu cấu hình). */
  rambo: () => LlmEndpoint | null;
  ramboDangNghi: () => boolean;
  goiRambo: (o: GoiAiCtWorkOpts, ep: LlmEndpoint, model: string) => Promise<KetQuaAiCtWork>;
  /** Cổng chính hãng có dùng được không (còn key, không đang nghỉ, trong trần $ ngày của CT Work) — theo bậc. */
  chinhHangSanSang: (userId: number, bac?: 'sonnet' | 'haiku') => Promise<boolean>;
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

/** Model chính hãng bậc DỰ PHÒNG (sau Sonnet): Haiku 5.5 — rẻ, nhanh. */
export function modelChinhHangDuPhong(): string {
  return process.env.CTWORK_MODEL_CHINH_HANG_DU_PHONG?.trim() || 'claude-haiku-5-5';
}

/**
 * Model trên RAMBO theo việc (chủ web chốt 22/10/2026 — gói trọn nên chọn theo CHẤT LƯỢNG, không theo giá):
 *   work_assistant (chat/thao tác hằng ngày, kể cả stream) ⇒ `claude-fable-5` (`CTWORK_RAMBO_MODEL` đè) — đo từ container
 *     prod 22/10: gọi tool đúng 3/3, ~3–7 s như sonnet-5 (sonnet-5 của rambo từng viết DSML khi không có tool);
 *   work_spec_review + việc PHÂN TÍCH NẶNG ít lượt (`nang: true`) ⇒ `claude-opus-5` (`CTWORK_RAMBO_MODEL_NANG`);
 *   work_digest ⇒ Sonnet mới nhất rambo có.
 * `LLM_MODEL_<VIỆC>=claude-…` vẫn đè (sau `CTWORK_RAMBO_MODEL`). Danh sách `/v1/models` của rambo đã đọc mà KHÔNG có model
 * đã chọn ⇒ `ramboSonic()` (Sonnet mới nhất rambo có — hôm nay claude-sonnet-5).
 */
export function modelRamboCho(purpose: ViecCtWork = 'work_assistant', nang = false): string {
  const ds = docDsModelRamboDaNho()?.ids;
  const chon = (m: string) => (!ds?.length || ds.includes(m) ? m : ramboSonic());
  const env = process.env[`LLM_MODEL_${purpose.toUpperCase()}`]?.trim();
  const nangModel = process.env.CTWORK_RAMBO_MODEL_NANG?.trim() || 'claude-opus-5';
  if (nang && purpose === 'work_assistant') return chon(nangModel);
  if (purpose === 'work_assistant') {
    const rieng = process.env.CTWORK_RAMBO_MODEL?.trim();
    if (rieng) return chon(rieng);
  }
  if (env && env.startsWith('claude-')) return chon(env);
  if (purpose === 'work_spec_review') return chon(nangModel);
  if (purpose === 'work_assistant') return chon('claude-fable-5');
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
/* 22/10/2026 (chủ web: "cho người dùng dùng nhiều hơn") — 30 → 100 $/ngày cả web, 3 → 10 $/ngày mỗi người. Chỉ cắn khi
   rambo hỏng. Haiku có thêm khoản nhỏ chồng lên (xem đầu file). */
const TRAN_TONG = () => soEnv('WORK_AI_CHINH_HANG_USD_NGAY', 100);
const TRAN_NGUOI = () => soEnv('WORK_AI_CHINH_HANG_USD_NGUOI_NGAY', 10);
const TRAN_HAIKU_TONG = () => soEnv('WORK_AI_CHINH_HANG_HAIKU_USD_NGAY', 20);
const TRAN_HAIKU_NGUOI = () => soEnv('WORK_AI_CHINH_HANG_HAIKU_USD_NGUOI_NGAY', 2);

/** Trần (cả web, mỗi người) của MỘT bậc chính hãng. THUẦN — test đọc. Trần người 0 = không trần người. */
export function tranChinhHang(bac: 'sonnet' | 'haiku'): { tong: number; nguoi: number } {
  const tong = TRAN_TONG();
  const nguoi = TRAN_NGUOI();
  if (bac === 'sonnet') return { tong, nguoi };
  return { tong: tong + TRAN_HAIKU_TONG(), nguoi: nguoi > 0 ? nguoi + TRAN_HAIKU_NGUOI() : 0 };
}

/** Đã tiêu (ca, nguoi) có còn trong trần của bậc không. THUẦN — test đọc. */
export function trongTranChinhHang(bac: 'sonnet' | 'haiku', daTieu: { ca: number; nguoi: number }): boolean {
  const t = tranChinhHang(bac);
  if (!(t.tong > 0)) return false;
  if (daTieu.ca >= t.tong) return false;
  return !(t.nguoi > 0 && daTieu.nguoi >= t.nguoi);
}

async function chinhHangSanSangThat(userId: number, bac: 'sonnet' | 'haiku' = 'sonnet'): Promise<boolean> {
  if (!(tranChinhHang(bac).tong > 0)) return false;
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
    return trongTranChinhHang(bac, { ca: Number(ca._sum.costUsd ?? 0), nguoi: Number(nguoi._sum.costUsd ?? 0) });
  } catch (err) {
    // Sổ hỏng ⇒ KHÔNG dùng bậc trả tiền này (an toàn về tiền) — bậc sau vẫn đỡ.
    logger.warn('[ctwork-ai] không đọc được sổ cổng chính hãng — bỏ qua bậc này', { error: (err as Error).message });
    return false;
  }
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
  /* 27/10/2026: danh sách chặn CuongMini trong CT Work (admin chặn / mở khoá). Một cửa này phủ MỌI việc AI của CT Work. */
  if (await biChanCuongMini(o.userId, 'CTWORK')) throw new AppError(cauBiChan('CTWORK'), 403, MA_LOI_CHAN);
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

  const chuoi = chuoiCtWork();
  const daThuChinhHang = new Set<string>();
  let chinhHangHong = false;
  let loiCuoi: unknown = null;
  for (let i = 0; i < chuoi.length; i++) {
    const bac = chuoi[i];
    const cong = congCuaBac(bac);
    const cuoi = i === chuoi.length - 1;
    // Cổng vừa trả markup gọi tool dạng chữ ⇒ bỏ qua ở lần làm lại — trừ bậc CUỐI (không còn gì khác để thử).
    if (!cuoi && o.boQuaCong?.includes(cong)) continue;
    huy();
    let model = '';
    try {
      let r: KetQuaAiCtWork;
      if (bac === 'rambo') {
        const ep = pt.rambo();
        if (!ep || pt.ramboDangNghi()) continue;
        model = modelRamboCho(o.purpose, o.nang);
        r = await pt.goiRambo(opts, ep, model);
      } else if (bac === 'modelapi') {
        model = modelModelapiCho(o.purpose);
        r = await pt.goiModelapi(opts, model);
      } else {
        const laSonnet = bac === 'chinh_hang_sonnet';
        model = laSonnet ? modelChinhHangCho(o.purpose) : modelChinhHangDuPhong();
        if (daThuChinhHang.has(model)) continue; // digest: bậc Sonnet vốn đã là Haiku
        if (!(await pt.chinhHangSanSang(o.userId, laSonnet ? 'sonnet' : 'haiku').catch(() => false))) continue;
        daThuChinhHang.add(model);
        r = await pt.goiChinhHang(opts, model);
      }
      if (!r.toolCalls?.length && laCauLoiCong(r.text)) {
        throw Object.assign(new Error(`${cong}: cổng trả câu báo lỗi thay vì câu trả lời — ${r.text.trim().slice(0, 120)}`), { code: 'CONG_TRA_LOI_LOI' });
      }
      if (chinhHangHong && cong !== 'chinh_hang') pt.baoChinhHangHong();
      return { ...r, bac };
    } catch (e) {
      if (laLoiChinhSach(e)) throw e;
      loiCuoi = e;
      const thong = (e as Error).message ?? '';
      const st = httpStatusCua(e);
      if (cong === 'chinh_hang') {
        const { laLoiCongHong } = await import('../agent/bangModel.js');
        if (laLoiCongHong(thong, (e as { code?: string }).code)) chinhHangHong = true;
      }
      // Rời khối chính hãng (bậc sau không phải chính hãng) ⇒ giờ mới báo cổng hỏng: Haiku vẫn được thử trước.
      if (chinhHangHong && (cuoi || congCuaBac(chuoi[i + 1]) !== 'chinh_hang')) { pt.baoChinhHangHong(); chinhHangHong = false; }
      logger.warn(`[ctwork-ai] ${bac} lỗi — tự chuyển bậc sau`, {
        purpose: o.purpose, model, bacSau: cuoi ? null : chuoi[i + 1], status: st ?? null,
        ...(cong === 'rambo' ? { khoaHong: laLoiKhoaRambo(st) } : {}), giuaChung: daPhat, error: thong.slice(0, 160),
      });
      if (cuoi) break;
      huy();
      // Câu báo lỗi của cổng không phải câu trả lời dở ⇒ xoá (không "viết tiếp" nó).
      if ((e as { code?: string }).code === 'CONG_TRA_LOI_LOI') xoaNhap(); else sauKhiHong();
    }
  }
  if (chinhHangHong) pt.baoChinhHangHong();
  throw loiCuoi ?? new AppError('CuongMini đang tạm nghỉ (không cổng AI nào dùng được) — thử lại sau ít phút. / The AI assistant is temporarily unavailable.', 503, 'WORK_AI_UNAVAILABLE');
}

/**
 * Cổng trả về một CÂU BÁO LỖI dưới dạng câu trả lời (HTTP 200) — "Verify your email…", hết số dư, khoá sai, không có
 * kênh… Chỉ xét câu NGẮN (câu trả lời thật dài hơn nhiều) và mẫu tiếng Anh/Trung của cổng bán lại. THUẦN — test đọc.
 */
export function laCauLoiCong(text: string): boolean {
  const t = (text ?? '').trim();
  if (!t || t.length > 400) return false;
  return /verify your email|email (is )?not verified|insufficient (balance|quota|credits?)|quota (has been )?exceeded|account (is |has been )?(suspended|disabled|banned)|invalid (api )?key|no available channel|please (log ?in|sign ?in|top ?up|recharge)|余额不足|额度不足|请先验证/i.test(t);
}

/** Tóm tắt chuỗi đang hiệu lực (cho trang admin / báo lỗi) — KHÔNG kèm khoá. */
export function chuoiCongHienTai(purpose: ViecCtWork = 'work_assistant'): Array<{ bac: BacCtWork; cong: CongCtWork; model: string; dungDuoc: boolean }> {
  return chuoiCtWork().map((bac) => {
    if (bac === 'rambo') return { bac, cong: 'rambo' as const, model: modelRamboCho(purpose), dungDuoc: !!ctworkDiRambo() && !ramboDangNghi() };
    if (bac === 'modelapi') return { bac, cong: 'modelapi' as const, model: modelModelapiCho(purpose), dungDuoc: true };
    const sonnet = bac === 'chinh_hang_sonnet';
    return { bac, cong: 'chinh_hang' as const, model: sonnet ? modelChinhHangCho(purpose) : modelChinhHangDuPhong(), dungDuoc: tranChinhHang(sonnet ? 'sonnet' : 'haiku').tong > 0 };
  });
}
