/**
 * "Create with CuongMini" — MỘT cửa gọi model cho cả luồng (đọc hiểu, lập kế hoạch, viết trang, sửa theo lời nhắn).
 *
 *   Mặc định CuongMini Sonic 5.5 (`cm-sonic`) ở cổng Anthropic CHÍNH HÃNG; tuỳ chọn CuongMini Optimum 5.5 (`cm-optimum`,
 *   cần vé KHOÁ CHUNG — cùng khoá mở Optimum trong CuongMini CLI; admin không cần).
 *   Cổng chính hãng không dùng được (hết key, đang đánh dấu hỏng, hết hạn mức Sonic, lỗi HTTP/hết giờ) ⇒ TỰ LÙI sang
 *   modelapi `gpt-6-sol` (purpose `work_setup`, không bao giờ đi rambo). Optimum: vé sai/hết hạn hoặc hết hạn mức "cao"
 *   ⇒ BÁO LỖI có mã (không âm thầm hạ model) để giao diện hỏi lại khoá / gợi ý đổi sang Sonic.
 *   Tên model thật không bao giờ ra giao diện — kết quả chỉ mang mã CuongMini + nguồn ("chinh_hang" | "modelapi").
 *
 * Mọi phụ thuộc ra ngoài gom trong `PhuThuocModel` ⇒ test thay bằng bản giả (`_datModelChoTest`).
 */

import { AppError } from '../../../middleware/errorHandler.js';
import { logger } from '../../../utils/logger.js';
import { checkTokenQuota, isAiAvailable, llmComplete } from '../../interview/llm/index.js';
import { costUsd } from '../../llm/gateway.js';
import { baoCongHong, congDangHong } from '../../agent/bangModel.js';
import type { UsageCall } from './kieu.js';

export const SETUP_MODELS = ['cm-sonic', 'cm-optimum'] as const;
export type SetupModelId = (typeof SETUP_MODELS)[number];
/** Tên hiển thị (khớp bangModel.ts) — giao diện chỉ thấy những tên này. */
export const SETUP_MODEL_NAME: Record<SetupModelId, string> = { 'cm-sonic': 'CuongMini Sonic 5.5', 'cm-optimum': 'CuongMini Optimum 5.5' };
const REAL: Record<SetupModelId, { model: string; hang: 'free' | 'cao' }> = {
  'cm-sonic': { model: 'claude-sonnet-5-5', hang: 'free' },
  'cm-optimum': { model: 'claude-opus-5-5', hang: 'cao' },
};

export interface HanMucLite { het: boolean; message?: string }

export interface PhuThuocModel {
  chinhHang: (o: {
    system: string; messages: Array<{ role: 'user' | 'assistant'; content: string }>; model: string; hang: 'free' | 'cao';
    maxTokens: number; userId: number; signal?: AbortSignal;
  }) => Promise<{ text: string; biCat: boolean; usd: number }>;
  duPhong: (o: { system: string; user: string; maxTokens: number; userId: number; timeoutMs: number }) => Promise<{ text: string; model: string; inputTokens: number; outputTokens: number; biCat?: boolean }>;
  coKey: () => Promise<boolean>;
  congHong: () => boolean;
  baoHong: () => void;
  /** Hạn mức chính hãng của người theo hạng + trần theo model (gộp). */
  hanMuc: (userId: number, id: SetupModelId) => Promise<HanMucLite>;
  /** Vé khoá chung còn sống (admin luôn true). */
  moKhoaCao: (userId: number, ve: unknown) => Promise<boolean>;
  /** Khoá chung đã được quản trị bật chưa (chưa ⇒ Optimum không dùng được). */
  khoaDaBat: () => Promise<boolean>;
  laAdmin: (userId: number) => Promise<boolean>;
  /** Trước đường lùi modelapi: AI web còn bật + trần token/ngày của người (như mọi việc CT Work AI). */
  kiemDuPhong: (userId: number) => Promise<void>;
}

/**
 * Hạn mức RIÊNG của "Create with CuongMini" (20/10/2026). Trước đây mượn trần AI Code (free/cao + trần theo model) ⇒
 * tài khoản không Pro (trần 0 $) LUÔN bị đẩy sang gpt-6-sol, trái ý chủ app "mặc định Sonnet 5.5 chính hãng". Nay đếm
 * riêng sổ chính hãng `viec = work_setup` theo ngày giờ VN: trần mỗi người + trần chung cả web (env, admin không trần).
 * Chạm trần ⇒ Sonic lùi gpt-6-sol (không chặn); Optimum báo lỗi để người dùng chọn lại.
 */
const TRAN_NGUOI_NGAY = () => Number(process.env.WORK_SETUP_USD_NGUOI_NGAY ?? 3);
const TRAN_TONG_NGAY = () => Number(process.env.WORK_SETUP_USD_NGAY ?? 40);

async function hanMucThat(userId: number, _id: SetupModelId): Promise<HanMucLite> {
  if (await THAT.laAdmin(userId)) return { het: false };
  const { prisma } = await import('../../../config/database.js');
  const { dauNgayVn } = await import('../../agent/anthropicChinhHang/hanMuc.js');
  const tu = dauNgayVn();
  const [nguoi, tong] = await Promise.all([
    prisma.anthropicUsage.aggregate({ where: { userId, viec: 'work_setup', createdAt: { gte: tu } }, _sum: { costUsd: true } }),
    prisma.anthropicUsage.aggregate({ where: { viec: 'work_setup', createdAt: { gte: tu } }, _sum: { costUsd: true } }),
  ]);
  if ((nguoi._sum.costUsd ?? 0) >= TRAN_NGUOI_NGAY()) return { het: true, message: 'You have used today’s CuongMini setup allowance. Try again tomorrow or continue with the standard model.' };
  if ((tong._sum.costUsd ?? 0) >= TRAN_TONG_NGAY()) return { het: true, message: 'CuongMini setup is busy today. Try again tomorrow or continue with the standard model.' };
  return { het: false };
}

const THAT: PhuThuocModel = {
  chinhHang: async (o) => {
    const { goiVanBanChinhHang } = await import('../../agent/anthropicChinhHang/dinhTuyen.js');
    // `viec = work_setup`: sổ chính hãng riêng — hạn mức riêng ở `hanMucThat`, không ăn trần AI Code.
    return goiVanBanChinhHang({ ...o, viec: 'work_setup' });
  },
  duPhong: async (o) => {
    const r = await llmComplete({
      step: 'report', system: o.system, messages: [{ role: 'user', content: o.user }],
      // > 4000 ⇒ chảy dần (tránh 524 với câu trả lời dài); trần ra đủ cho JSON lớn + token suy luận.
      maxTokens: Math.max(8000, o.maxTokens), userId: o.userId, feature: 'work', purpose: 'work_setup', timeoutMs: o.timeoutMs, maxRetries: 1,
    });
    return { text: r.text, model: r.model, inputTokens: r.inputTokens, outputTokens: r.outputTokens, biCat: r.biCat };
  },
  coKey: async () => (await import('../../agent/anthropicChinhHang/khoKey.js')).coKeyKhaDung(),
  congHong: () => congDangHong('anthropic'),
  baoHong: () => baoCongHong('anthropic'),
  hanMuc: hanMucThat,
  moKhoaCao: async (userId, ve) => {
    const { quyenChinhHang } = await import('../../agent/anthropicChinhHang/dinhTuyen.js');
    return (await quyenChinhHang(userId, ve)).modelCao;
  },
  khoaDaBat: async () => (await import('../../agent/anthropicChinhHang/ve.js')).daBatMatKhau('chung'),
  laAdmin: async (userId) => {
    try { return await (await import('../../pro.service.js')).laAdmin(userId); } catch { return false; }
  },
  kiemDuPhong: async (userId) => {
    if (!isAiAvailable('work')) throw new AppError('CuongMini is temporarily unavailable. Please try again later.', 503, 'WORK_AI_UNAVAILABLE');
    if (!(await checkTokenQuota(userId))) throw new AppError('You have reached today’s AI usage limit.', 429, 'WORK_AI_TOKEN_CAP');
  },
};
let pt: PhuThuocModel = THAT;
/** Test: thay phụ thuộc (null = trả lại bản thật). */
export function _datModelChoTest(p: Partial<PhuThuocModel> | null): void {
  pt = p ? { ...THAT, ...p } : THAT;
}

export interface GoiKetQua { text: string; cut: boolean; call: UsageCall }

/** Kiểm trước khi chạy job (để báo lỗi NGAY ở nút bấm, không phải giữa chừng): khoá Optimum + hạn mức "cao". */
export async function kiemModelTruoc(userId: number, id: SetupModelId, ve: unknown): Promise<void> {
  if (id !== 'cm-optimum') return;
  if (!(await pt.laAdmin(userId))) {
    if (!(await pt.khoaDaBat())) throw new AppError('CuongMini Optimum 5.5 is not available yet.', 409, 'WORK_SETUP_MODEL_UNAVAILABLE');
    if (!(await pt.moKhoaCao(userId, ve))) throw new AppError('Enter the CuongMini key to use CuongMini Optimum 5.5.', 403, 'WORK_SETUP_KEY_REQUIRED');
  }
  const h = await pt.hanMuc(userId, id).catch(() => ({ het: true, message: 'Could not read your usage limit.' }));
  if (h.het) throw new AppError(h.message ?? 'You have reached the CuongMini Optimum 5.5 limit. Switch to CuongMini Sonic 5.5.', 429, 'WORK_SETUP_MODEL_LIMIT');
}

/** Thông tin cho ô chọn model (không lộ tên thật). */
export async function modelChoGiaoDien(userId: number, ve: unknown): Promise<Array<{ id: SetupModelId; name: string; locked: boolean; available: boolean; default: boolean }>> {
  const admin = await pt.laAdmin(userId);
  const [bat, mo] = admin ? [true, true] : await Promise.all([pt.khoaDaBat().catch(() => false), pt.moKhoaCao(userId, ve).catch(() => false)]);
  return [
    { id: 'cm-sonic', name: SETUP_MODEL_NAME['cm-sonic'], locked: false, available: true, default: true },
    { id: 'cm-optimum', name: SETUP_MODEL_NAME['cm-optimum'], locked: !admin && !mo, available: admin || bat, default: false },
  ];
}

/**
 * Một lời gọi: chính hãng trước (đủ điều kiện), lỗi ⇒ lùi modelapi. `step` ghi vào sổ của bản nháp.
 * Ném AppError khi KHÔNG đường nào chạy được (giao diện hiện lỗi + cho chạy lại).
 */
export async function goiModel(o: {
  userId: number; modelId: SetupModelId; ve?: unknown; step: string;
  system: string; user: string; maxTokens: number; timeoutMs?: number; signal?: AbortSignal;
}): Promise<GoiKetQua> {
  const real = REAL[o.modelId];
  const timeoutMs = o.timeoutMs ?? 240_000;
  let thuChinhHang = true;
  if (o.modelId === 'cm-optimum') {
    await kiemModelTruoc(o.userId, o.modelId, o.ve); // Optimum: không âm thầm hạ model
  } else {
    const h = await pt.hanMuc(o.userId, o.modelId).catch(() => ({ het: true }));
    if (h.het) thuChinhHang = false;
  }
  if (thuChinhHang && (pt.congHong() || !(await pt.coKey().catch(() => false)))) thuChinhHang = false;

  if (thuChinhHang) {
    const t0 = Date.now();
    const ctl = new AbortController();
    const hen = setTimeout(() => ctl.abort(), timeoutMs);
    const onAbort = () => ctl.abort();
    o.signal?.addEventListener('abort', onAbort, { once: true });
    try {
      const r = await pt.chinhHang({ system: o.system, messages: [{ role: 'user', content: o.user }], model: real.model, hang: real.hang, maxTokens: o.maxTokens, userId: o.userId, signal: ctl.signal });
      if (r.text.trim()) {
        return {
          text: r.text, cut: r.biCat,
          call: { step: o.step, path: 'chinh_hang', model: o.modelId, inputTokens: Math.round((o.system.length + o.user.length) / 4), outputTokens: Math.round(r.text.length / 4), usd: r.usd, ms: Date.now() - t0, ok: true },
        };
      }
      throw new Error('empty reply');
    } catch (e) {
      if (o.signal?.aborted) throw new AppError('Cancelled', 499, 'WORK_SETUP_CANCELLED');
      logger.warn('[tao-cuongmini] cổng chính hãng lỗi — lùi gpt-6-sol', { step: o.step, error: (e as Error).message });
      // Optimum đã mở khoá + còn hạn mức: cổng hỏng thì vẫn lùi (yêu cầu "tự lùi khi cổng không dùng được").
      pt.baoHong();
    } finally {
      clearTimeout(hen);
      o.signal?.removeEventListener('abort', onAbort);
    }
  }

  if (o.signal?.aborted) throw new AppError('Cancelled', 499, 'WORK_SETUP_CANCELLED');
  await pt.kiemDuPhong(o.userId);
  const t0 = Date.now();
  /* Lỗi mạng THOÁNG QUA (chạy thật 20/10: "terminated" giữa luồng ở lượt đầu của bước kế hoạch ⇒ cả kế hoạch FAILED)
     ⇒ tự thử lại tối đa 2 lần, giãn 2 s/5 s. Lỗi khác (hết trần, 4xx) ném ngay. */
  let r: Awaited<ReturnType<PhuThuocModel['duPhong']>> | null = null;
  for (let lan = 0; ; lan++) {
    try {
      r = await pt.duPhong({ system: o.system, user: o.user, maxTokens: o.maxTokens, userId: o.userId, timeoutMs });
      break;
    } catch (e) {
      if (o.signal?.aborted) throw new AppError('Cancelled', 499, 'WORK_SETUP_CANCELLED');
      if (lan >= 2 || !laLoiThoangQua(e)) throw e;
      logger.warn('[tao-cuongmini] cổng dự phòng lỗi thoáng qua — thử lại', { step: o.step, lan: lan + 1, error: (e as Error).message });
      await new Promise((ok) => setTimeout(ok, lan === 0 ? 2000 : 5000));
    }
  }
  if (!r.text.trim()) throw new AppError('CuongMini returned an empty answer. Try again.', 502, 'WORK_AI_BAD_OUTPUT');
  return {
    text: r.text, cut: !!r.biCat,
    call: { step: o.step, path: 'modelapi', model: o.modelId, inputTokens: r.inputTokens, outputTokens: r.outputTokens, usd: costUsd(r.model, r.inputTokens, r.outputTokens), ms: Date.now() - t0, ok: true },
  };
}

/** Lỗi mạng/cổng tạm thời — đáng thử lại (không phải hết trần, sai khoá, 4xx). */
export function laLoiThoangQua(e: unknown): boolean {
  const m = String((e as Error)?.message ?? e ?? '');
  const st = Number((e as { status?: unknown; statusCode?: unknown })?.status ?? (e as { statusCode?: unknown })?.statusCode ?? 0);
  if (st === 429 || st >= 500) return true;
  return /terminated|fetch failed|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|socket hang up|other side closed|timed? ?out|Upstream stream ended|\b(502|503|504|524)\b/i.test(m);
}

/** Tên model thật cho sổ CT Work AI usage (work_ai_calls.model) — tên đó được aiUsage đổi ra tên CuongMini khi hiển thị. */
export function realModelFor(call: UsageCall): string {
  return call.path === 'chinh_hang' ? REAL[(call.model as SetupModelId)]?.model ?? 'claude-sonnet-5-5' : 'gpt-6-sol';
}
