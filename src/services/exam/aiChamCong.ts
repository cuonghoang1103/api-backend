/**
 * ============================================================
 * PHÒNG THI — CHUỖI CỔNG CHẤM BÀI (24/10/2026)
 * ============================================================
 *
 * Chủ kênh chốt: bài thi LUÔN được chấm bằng Claude. Mọi lời gọi chấm của `exam.grading.service.ts` (gradeCode .zip,
 * gradeWrite có/không ảnh sơ đồ, gradeSpeaking phần chấm chữ, sinh câu hỏi nói) đi qua MỘT cửa này:
 *
 *   1. RAMBO (gói trả trọn ⇒ chi phí biên 0) — `claude-opus-5` (`EXAM_RAMBO_MODEL`, hoặc `LLM_MODEL_EXAM_GRADE=claude-…`).
 *      Cờ RIÊNG `EXAM_RAMBO` (mặc định BẬT, không phụ thuộc công tắc rambo toàn cục — như `CTWORK_RAMBO`); cần
 *      `AGENT_GATEWAY_BASE_URL` + `_API_KEY`. `/v1/models` của rambo không có model đã chọn ⇒ Sonnet mới nhất nó có.
 *   2. Anthropic CHÍNH HÃNG `claude-sonnet-5-5` (`EXAM_MODEL_CHINH_HANG`) — trần RIÊNG của việc chấm:
 *      `EXAM_CHINH_HANG_USD_NGAY` (15 $/ngày cả web) · `EXAM_CHINH_HANG_USD_NGUOI_NGAY` (1,5 $/ngày mỗi người), sổ
 *      `anthropic_usage.viec = 'exam_grade'` (không ăn trần CT Work `work_ai` / AI Code). Vượt trần ⇒ bậc 3.
 *   3. modelapi `gpt-6-sol` (lùi CUỐI; nhìn ảnh đúng — đo 27/09). `LLM_MODEL_EXAM_GRADE=gpt-…` đè (không đè lượt có ẢNH).
 *
 * Bậc nào hỏng (mạng, 401/403/410, 5xx, hết giờ, trả rỗng, trả câu báo lỗi của cổng, cầu dao đang mở, hết key, hết trần)
 * ⇒ TỰ sang bậc sau trong CÙNG lượt, người dùng không thấy lỗi. ẢNH (khối `image` kiểu Claude) đi nguyên vẹn cả 3 bậc.
 * Bậc đã chấm được ghi log `[exam-cham]` (admin xem chuỗi đang hiệu lực ở `/admin/commerce?tab=anthropic`).
 * Không ghi khoá ra log.
 */

import { AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { ghiSoLlm, httpStatusCua, llmComplete, type LLMMessage } from '../interview/llm/index.js';
import { checkBudget, budgetMessage } from '../llm/budget.js';
import {
  congRamboCauHinh, docDsModelRamboDaNho, fallbackEndpoint, laLoiKhoaRambo, modelDuPhongModelapi, ramboDangNghi, ramboSonic, type LlmEndpoint,
} from '../llm/gateway.js';
import { laCauLoiCong } from '../work/aiCong.js';

export type BacChamThi = 'rambo' | 'chinh_hang_sonnet' | 'modelapi';
export type CongChamThi = 'rambo' | 'chinh_hang' | 'modelapi';
export const CHUOI_CHAM_THI: readonly BacChamThi[] = ['rambo', 'chinh_hang_sonnet', 'modelapi'];
const congCuaBac = (b: BacChamThi): CongChamThi => (b === 'chinh_hang_sonnet' ? 'chinh_hang' : b);

export interface GoiChamThiOpts {
  system: string;
  messages: LLMMessage[];
  maxTokens: number;
  userId: number;
  /** Hết giờ mỗi bậc. */
  timeoutMs?: number;
  /** Số lần thử lại ở modelapi (rambo/chính hãng không thử lại — đã có bậc sau). */
  maxRetries?: number;
}

export interface KetQuaChamThi {
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  biCat?: boolean;
  cong: CongChamThi;
  bac?: BacChamThi;
}

// ─── Phụ thuộc (test thay được) ─────────────────────────────────

export interface PhuThuocChamThi {
  rambo: () => LlmEndpoint | null;
  ramboDangNghi: () => boolean;
  goiRambo: (o: GoiChamThiOpts, ep: LlmEndpoint, model: string) => Promise<KetQuaChamThi>;
  /** Cổng chính hãng dùng được không (trần > 0, không đang nghỉ, còn key, trong trần $ ngày của việc chấm). */
  chinhHangSanSang: (userId: number) => Promise<boolean>;
  goiChinhHang: (o: GoiChamThiOpts, model: string) => Promise<KetQuaChamThi>;
  baoChinhHangHong: () => void;
  goiModelapi: (o: GoiChamThiOpts, model: string) => Promise<KetQuaChamThi>;
}

/** Lượt có ẢNH không (khối `image` trong tin nhắn). */
export function coAnh(messages: LLMMessage[]): boolean {
  return messages.some((m) => Array.isArray(m.content) && m.content.some((b) => (b as { type?: string }).type === 'image'));
}

/** Rambo cho việc chấm: cờ riêng `EXAM_RAMBO` — 27/10/2026 mặc định TẮT (ngừng rambo); bật lại EXAM_RAMBO=1. */
export function examDiRambo(): LlmEndpoint | null {
  const env = process.env.EXAM_RAMBO?.trim();
  if (env !== '1' && env !== 'true') return null;
  return congRamboCauHinh();
}

/** Model trên rambo: `EXAM_RAMBO_MODEL` › `LLM_MODEL_EXAM_GRADE=claude-…` › `claude-opus-5`; rambo không có ⇒ Sonnet mới nhất. */
export function modelRamboChamThi(): string {
  const env = process.env.LLM_MODEL_EXAM_GRADE?.trim();
  const m = process.env.EXAM_RAMBO_MODEL?.trim() || (env && env.startsWith('claude-') ? env : '') || 'claude-opus-5';
  const ds = docDsModelRamboDaNho()?.ids;
  return !ds?.length || ds.includes(m) ? m : ramboSonic();
}

/** Model chính hãng (KHÔNG Opus chính hãng — quá đắt). */
export function modelChinhHangChamThi(): string {
  return process.env.EXAM_MODEL_CHINH_HANG?.trim() || 'claude-sonnet-5-5';
}

/** Lùi cuối ở modelapi: `LLM_MODEL_EXAM_GRADE` nếu là model GPT và lượt KHÔNG có ảnh; còn lại gpt-6-sol (nhìn ảnh thật). */
export function modelModelapiChamThi(anh = false): string {
  const env = process.env.LLM_MODEL_EXAM_GRADE?.trim();
  return !anh && env && !env.startsWith('claude-') ? env : modelDuPhongModelapi();
}

function soEnv(ten: string, mac: number): number {
  const raw = process.env[ten]?.trim();
  if (!raw) return mac; // để trống (như .env.example) ⇒ mặc định, KHÔNG phải 0
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : mac;
}

/** Trần $/ngày (giờ VN) của việc chấm trên cổng chính hãng. Tổng 0 = không dùng bậc này; người 0 = không trần người. */
export function tranChinhHangChamThi(): { tong: number; nguoi: number } {
  return { tong: soEnv('EXAM_CHINH_HANG_USD_NGAY', 15), nguoi: soEnv('EXAM_CHINH_HANG_USD_NGUOI_NGAY', 1.5) };
}

/** Đã tiêu (ca, nguoi) còn trong trần không. THUẦN — test đọc. */
export function trongTranChamThi(daTieu: { ca: number; nguoi: number }): boolean {
  const t = tranChinhHangChamThi();
  if (!(t.tong > 0)) return false;
  if (daTieu.ca >= t.tong) return false;
  return !(t.nguoi > 0 && daTieu.nguoi >= t.nguoi);
}

async function chinhHangSanSangThat(userId: number): Promise<boolean> {
  if (!(tranChinhHangChamThi().tong > 0)) return false;
  const { congDangHong } = await import('../agent/bangModel.js');
  if (congDangHong('anthropic')) return false;
  const { coKeyKhaDung } = await import('../agent/anthropicChinhHang/khoKey.js');
  if (!(await coKeyKhaDung())) return false;
  try {
    const { prisma } = await import('../../config/database.js');
    const { dauNgayVn } = await import('../agent/anthropicChinhHang/hanMuc.js');
    const tu = dauNgayVn();
    const [ca, nguoi] = await Promise.all([
      prisma.anthropicUsage.aggregate({ where: { viec: 'exam_grade', createdAt: { gte: tu } }, _sum: { costUsd: true } }),
      prisma.anthropicUsage.aggregate({ where: { viec: 'exam_grade', userId, createdAt: { gte: tu } }, _sum: { costUsd: true } }),
    ]);
    return trongTranChamThi({ ca: Number(ca._sum.costUsd ?? 0), nguoi: Number(nguoi._sum.costUsd ?? 0) });
  } catch (err) {
    // Sổ hỏng ⇒ KHÔNG dùng bậc trả tiền (an toàn về tiền) — modelapi vẫn đỡ.
    logger.warn('[exam-cham] không đọc được sổ cổng chính hãng — bỏ qua bậc này', { error: (err as Error).message });
    return false;
  }
}

/** Ước lượng token (cổng chính hãng trả USD thật qua sổ riêng) — đủ cho trần token/ngày của người. */
function uocToken(o: GoiChamThiOpts, text: string): { inputTokens: number; outputTokens: number } {
  const vao = o.system.length + o.messages.reduce((n, m) => n + (typeof m.content === 'string' ? m.content.length
    : m.content.reduce((k, b) => k + (b.type === 'text' ? b.text.length : 6000), 0)), 0);
  return { inputTokens: Math.ceil(vao / 4), outputTokens: Math.ceil(text.length / 4) };
}

const THAT: PhuThuocChamThi = {
  rambo: () => examDiRambo(),
  ramboDangNghi: () => ramboDangNghi(),
  goiRambo: async (o, ep, model) => {
    const r = await llmComplete({
      step: 'interview', purpose: 'exam_grade', feature: 'exam', system: o.system, messages: o.messages, maxTokens: o.maxTokens,
      userId: o.userId, timeoutMs: o.timeoutMs ?? 60_000, maxRetries: 0, diemCuoi: ep, model, khongLui: true,
    });
    return { text: r.text, model: r.model, inputTokens: r.inputTokens, outputTokens: r.outputTokens, biCat: r.biCat, cong: 'rambo' };
  },
  chinhHangSanSang: chinhHangSanSangThat,
  goiChinhHang: async (o, model) => {
    // Trần TIỀN/ngày của cả web vẫn áp (budget.ts) — lượt chính hãng được ghi vào cùng sổ ngay dưới.
    const v = await checkBudget('interactive');
    if (!v.allowed) throw new AppError(budgetMessage(v), 429, 'BUDGET_EXCEEDED');
    const { goiVanBanChinhHang } = await import('../agent/anthropicChinhHang/dinhTuyen.js');
    const ctl = new AbortController();
    // Sàn 75 s: cắt giữa chừng một lượt chính hãng là trả tiền cho chữ bỏ đi rồi vẫn phải lùi modelapi.
    const hen = setTimeout(() => ctl.abort(), Math.max(o.timeoutMs ?? 60_000, 75_000));
    try {
      const r = await goiVanBanChinhHang({
        system: o.system,
        messages: o.messages.map((m) => ({ role: m.role, content: typeof m.content === 'string' ? m.content : (m.content as unknown as Array<Record<string, unknown>>) })),
        model, hang: 'free', maxTokens: o.maxTokens, userId: o.userId, viec: 'exam_grade',
        nhanh: { effort: 'medium' }, signal: ctl.signal,
      });
      if (!r.text.trim()) throw new Error('chinh_hang: empty reply');
      const tok = uocToken(o, r.text);
      await ghiSoLlm({ userId: o.userId, feature: 'exam', step: 'interview', model, ...tok, success: true, purpose: 'exam_grade', costUsd: r.usd, provider: 'anthropic-chinh-hang' }).catch(() => {});
      return { text: r.text, model, ...tok, biCat: r.biCat, cong: 'chinh_hang' };
    } finally {
      clearTimeout(hen);
    }
  },
  baoChinhHangHong: () => { void import('../agent/bangModel.js').then((m) => m.baoCongHong('anthropic')).catch(() => {}); },
  goiModelapi: async (o, model) => {
    const r = await llmComplete({
      step: 'interview', purpose: 'exam_grade', feature: 'exam', system: o.system, messages: o.messages, maxTokens: o.maxTokens,
      userId: o.userId, timeoutMs: o.timeoutMs ?? 60_000, maxRetries: o.maxRetries ?? 1, diemCuoi: fallbackEndpoint(model), model,
    });
    return { text: r.text, model: r.model, inputTokens: r.inputTokens, outputTokens: r.outputTokens, biCat: r.biCat, cong: 'modelapi' };
  },
};

let pt: PhuThuocChamThi = THAT;
/** CHỈ cho test: thay từng phụ thuộc (null = bản thật). */
export function _datCongChamThiChoTest(p: Partial<PhuThuocChamThi> | null): void {
  pt = p ? { ...THAT, ...p } : THAT;
}

/** Lỗi do CHÍNH SÁCH (hết trần tiền của cả web) ⇒ không lùi tiếp, báo thẳng. */
function laLoiChinhSach(e: unknown): boolean {
  return (e as { code?: string })?.code === 'BUDGET_EXCEEDED';
}

/** Một lượt chấm bài phòng thi qua chuỗi cổng. Ném lỗi của bậc CUỐI khi mọi bậc đều hỏng. */
export async function goiChamThi(o: GoiChamThiOpts): Promise<KetQuaChamThi> {
  const anh = coAnh(o.messages);
  let loiCuoi: unknown = null;
  for (let i = 0; i < CHUOI_CHAM_THI.length; i++) {
    const bac = CHUOI_CHAM_THI[i];
    const cong = congCuaBac(bac);
    const cuoi = i === CHUOI_CHAM_THI.length - 1;
    let model = '';
    try {
      let r: KetQuaChamThi;
      if (bac === 'rambo') {
        const ep = pt.rambo();
        if (!ep || pt.ramboDangNghi()) continue;
        model = modelRamboChamThi();
        r = await pt.goiRambo(o, ep, model);
      } else if (bac === 'chinh_hang_sonnet') {
        if (!(await pt.chinhHangSanSang(o.userId).catch(() => false))) continue;
        model = modelChinhHangChamThi();
        r = await pt.goiChinhHang(o, model);
      } else {
        model = modelModelapiChamThi(anh);
        r = await pt.goiModelapi(o, model);
      }
      if (!r.text.trim()) throw new Error(`${cong}: empty reply`);
      if (laCauLoiCong(r.text)) {
        throw Object.assign(new Error(`${cong}: cổng trả câu báo lỗi thay vì bài chấm — ${r.text.trim().slice(0, 120)}`), { code: 'CONG_TRA_LOI_LOI' });
      }
      logger.info('[exam-cham] đã chấm', { bac, cong, model: r.model || model, coAnh: anh, userId: o.userId });
      return { ...r, bac };
    } catch (e) {
      if (laLoiChinhSach(e)) throw e;
      loiCuoi = e;
      const thong = (e as Error).message ?? '';
      const st = httpStatusCua(e);
      if (cong === 'chinh_hang') {
        const { laLoiCongHong } = await import('../agent/bangModel.js');
        if (laLoiCongHong(thong, (e as { code?: string }).code)) pt.baoChinhHangHong();
      }
      logger.warn(`[exam-cham] ${bac} lỗi — tự chuyển bậc sau`, {
        model, bacSau: cuoi ? null : CHUOI_CHAM_THI[i + 1], status: st ?? null, coAnh: anh,
        ...(cong === 'rambo' ? { khoaHong: laLoiKhoaRambo(st) } : {}), error: thong.slice(0, 160),
      });
      if (cuoi) break;
    }
  }
  throw loiCuoi ?? new AppError('AI chấm bài đang tạm nghỉ (không cổng nào dùng được) — thử lại sau ít phút.', 503, 'EXAM_AI_UNAVAILABLE');
}

/** Tóm tắt chuỗi đang hiệu lực (trang admin) — KHÔNG kèm khoá. */
export function chuoiChamThiHienTai(): Array<{ bac: BacChamThi; cong: CongChamThi; model: string; dungDuoc: boolean }> {
  return CHUOI_CHAM_THI.map((bac) => {
    if (bac === 'rambo') return { bac, cong: 'rambo' as const, model: modelRamboChamThi(), dungDuoc: !!examDiRambo() && !ramboDangNghi() };
    if (bac === 'modelapi') return { bac, cong: 'modelapi' as const, model: modelModelapiChamThi(), dungDuoc: true };
    return { bac, cong: 'chinh_hang' as const, model: modelChinhHangChamThi(), dungDuoc: tranChinhHangChamThi().tong > 0 };
  });
}
