/**
 * ĐỊNH TUYẾN cổng Claude chính hãng: quyền, danh sách model cho app, lời mời
 * nâng cấp, và lời gọi VĂN BẢN đơn (CuongMini trong thi — `exam_tutor`).
 *
 * Thứ tự khi rambo hỏng (agent_code + exam_tutor):
 *   rambo ⇒ (người dùng đã chọn model cao + có vé/admin ⇒ model cao chính hãng)
 *         ⇒ CuongMini Free (ai dùng được AI Code/CuongMini đều được, tính trần free)
 *         ⇒ modelapi (vé dự phòng, như cũ)
 *         ⇒ báo `RAMBO_BAO_TRI`.
 */
import type { LlmEndpoint } from '../../llm/gateway.js';
import { logger } from '../../../utils/logger.js';
import {
  MA_FREE, dsModelChinhHangGoc, gocChinhHang,
  type HangChinhHang, type ModelChinhHang,
} from './cauHinh.js';
import { coKeyKhaDung } from './khoKey.js';
import { ghiDung, guiChinhHang, type NguCanhGoi } from './goi.js';
import { dungThanChinhHang, thanAnToan, type ThanAnthropic } from './thanYeuCau.js';
import { daBatMatKhauAnthropic, veAnthropicHopLe } from './ve.js';

export const NHAN_CONG_ANTHROPIC = 'cong-anthropic';

/** Điểm cuối cho `turn.ts`. `key` để trống — khoá chọn theo lượt ở `guiChinhHang`. */
export function diemCuoiChinhHang(): LlmEndpoint {
  return { root: gocChinhHang(), key: undefined, local: false, label: NHAN_CONG_ANTHROPIC, giaoThuc: 'anthropic' };
}

async function laAdminNguoi(userId: number): Promise<boolean> {
  try {
    const { laAdmin } = await import('../../pro.service.js');
    return await laAdmin(userId);
  } catch {
    return false;
  }
}

export interface QuyenChinhHang {
  laAdmin: boolean;
  /** Được dùng MODEL CAO (admin hoặc vé hợp lệ). */
  modelCao: boolean;
}

export async function quyenChinhHang(userId: number, ve: unknown): Promise<QuyenChinhHang> {
  const laAdmin = await laAdminNguoi(userId);
  return { laAdmin, modelCao: laAdmin || (ve ? await veAnthropicHopLe(userId, ve) : false) };
}

export interface ModelChinhHangChoApp extends ModelChinhHang {
  cong: 'anthropic';
  mienPhi: boolean;
  /** Cần nhập mật khẩu cổng này trước khi dùng (người thường chưa có vé). */
  canMoKhoa: boolean;
  dungDuoc: boolean;
}

/** Bốn mục thêm vào `info.models` của `/agent/tools`. */
export async function dsModelChinhHang(q: QuyenChinhHang): Promise<ModelChinhHangChoApp[]> {
  const coKey = await coKeyKhaDung();
  return dsModelChinhHangGoc().map((m) => ({
    ...m,
    cong: 'anthropic' as const,
    mienPhi: m.hang === 'free',
    canMoKhoa: m.hang === 'cao' && !q.modelCao,
    dungDuoc: coKey,
  }));
}

export interface CongNangCap {
  cong: 'anthropic' | 'modelapi';
  ten: string;
  /** Admin đã đặt mật khẩu cho cổng này chưa (chưa ⇒ người thường không mở được). */
  daBat: boolean;
  canMatKhau: boolean;
  models: Array<{ id: string; ten: string; mo: string; dat?: boolean; dungDuoc: boolean }>;
}

/** Dữ liệu cho lời mời nâng cấp khi đang chạy CuongMini Free. */
export async function cacCongNangCap(userId: number, o: { veAnthropic?: unknown; veDuPhong?: unknown }): Promise<CongNangCap[]> {
  const q = await quyenChinhHang(userId, o.veAnthropic);
  const coKey = await coKeyKhaDung();
  const dp = await import('../congDuPhong.js');
  const coVeDp = q.laAdmin || (o.veDuPhong ? await dp.veDuPhongHopLe(userId, o.veDuPhong).catch(() => false) : false);
  return [
    {
      cong: 'anthropic',
      ten: 'Anthropic chính hãng',
      daBat: q.laAdmin || (await daBatMatKhauAnthropic()),
      canMatKhau: !q.modelCao,
      models: dsModelChinhHangGoc().filter((m) => m.hang === 'cao')
        .map((m) => ({ id: m.id, ten: m.ten, mo: m.mo, ...(m.dat ? { dat: true } : {}), dungDuoc: coKey })),
    },
    {
      cong: 'modelapi',
      ten: 'modelapi',
      daBat: q.laAdmin || (await dp.daCoMatKhau().catch(() => false)),
      canMatKhau: !coVeDp,
      models: dp.MODEL_DU_PHONG.map((m) => ({ id: m.id, ten: m.ten, mo: m.mo, dungDuoc: Boolean(dp.congDuPhong(m.id)) })),
    },
  ];
}

export const CAU_DOI_CONG_FREE = 'Cổng chính đang gặp sự cố — đang tự chuyển sang model CuongMini Free.';

export function modelFreeChoApp(): ModelChinhHang {
  return dsModelChinhHangGoc().find((m) => m.id === MA_FREE)!;
}

/**
 * Một lời gọi VĂN BẢN có stream (không tool) — cho CuongMini trong thi.
 * Tự chuyển key, tự ghi sổ. Ném `CongAnthropicLoi` khi hết key.
 */
export async function goiVanBanChinhHang(o: {
  system: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  model: string;
  hang: HangChinhHang;
  maxTokens: number;
  userId: number;
  viec: NguCanhGoi['viec'];
  onToken?: (delta: string) => void;
  signal?: AbortSignal;
}): Promise<{ text: string; biCat: boolean; usd: number }> {
  const body: ThanAnthropic = {
    model: o.model,
    max_tokens: o.maxTokens,
    stream: true,
    system: o.system,
    messages: o.messages.filter((m) => m.content).map((m) => ({ ...m })),
  };
  /* Không cắt câu trả lời: thinking cũng ăn vào max_tokens ⇒ tối thiểu 16K. */
  const beta = await dungThanChinhHang(body, { laAgent: false, maxTokens: Math.max(o.maxTokens, 16_000) });
  const nguCanh: NguCanhGoi = { userId: o.userId, viec: o.viec, hang: o.hang, model: o.model };
  const ctl = new AbortController();
  if (o.signal) o.signal.addEventListener('abort', () => ctl.abort(), { once: true });
  const g = await guiChinhHang({ body, signal: ctl.signal, nguCanh, beta, banAnToan: () => thanAnToan(body) });

  let text = '';
  let stop: string | null = null;
  const dung = { input: 0, output: 0, cacheDoc: 0, cacheGhi: 0 };
  let thanhCong = false;
  let usd = 0;
  try {
    const reader = g.res.body!.getReader();
    const dec = new TextDecoder();
    let buf = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const dong = buf.split('\n');
      buf = dong.pop() ?? '';
      for (const d of dong) {
        if (!d.startsWith('data: ')) continue;
        let j: any;
        try { j = JSON.parse(d.slice(6)); } catch { continue; }
        if (j.type === 'message_start') {
          const u = j.message?.usage ?? {};
          dung.input = u.input_tokens ?? 0;
          dung.cacheDoc = u.cache_read_input_tokens ?? 0;
          dung.cacheGhi = u.cache_creation_input_tokens ?? 0;
        } else if (j.type === 'content_block_delta' && j.delta?.type === 'text_delta' && typeof j.delta.text === 'string') {
          text += j.delta.text;
          o.onToken?.(j.delta.text);
        } else if (j.type === 'message_delta') {
          if (j.delta?.stop_reason) stop = j.delta.stop_reason;
          if (j.usage?.output_tokens) dung.output = j.usage.output_tokens;
        } else if (j.type === 'error') {
          throw new Error(`Cổng chính hãng trả lỗi: ${JSON.stringify(j.error ?? j).slice(0, 200)}`);
        }
      }
    }
    thanhCong = true;
  } finally {
    usd = await ghiDung({ ...nguCanh, keyId: g.key.id, dung, thanhCong, thoiGianMs: Date.now() - g.batDau, ttfbMs: g.ttfbMs });
    if (!thanhCong) logger.warn('[anthropic] luồng văn bản gãy giữa chừng', { model: o.model, usd });
  }
  return { text, biCat: stop === 'max_tokens', usd };
}
