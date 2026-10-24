/**
 * GỌI api.anthropic.com + TỰ CHUYỂN KEY + GHI SỔ.
 *
 * Luật chuyển key cho MỘT lời gọi (thử lần lượt theo thứ tự ưu tiên):
 *   400 "credit balance is too low" / 402 billing_error ⇒ key `hetCredit`, thử key kế.
 *   401 / 403                                           ⇒ key `loi`, thử key kế.
 *   429 / 529 / 5xx / 408 / mất mạng                     ⇒ thử key kế, KHÔNG đổi trạng thái.
 *   4xx khác (yêu cầu sai)                               ⇒ ném luôn: key nào cũng sẽ trả y hệt.
 * Hết key ⇒ `CongAnthropicLoi` — nơi gọi lùi tiếp sang modelapi nếu được.
 *
 * Chỉ quyết định bằng MÃ HTTP trước khi luồng mở. Đã nhận 200 mà luồng gãy
 * giữa chừng thì KHÔNG đổi key gọi lại ở đây — chữ đã chảy tới người dùng,
 * gọi lại là in đôi; nơi gọi tự quyết.
 */
import { prisma } from '../../../config/database.js';
import { logger } from '../../../utils/logger.js';
import { PHIEN_BAN_API, gocChinhHang, type HangChinhHang } from './cauHinh.js';
import { tinhUsd, type DungToken } from './gia.js';
import { danhDauKey, keyKhaDung, type KeyDungDuoc } from './khoKey.js';

/** 400 này có phải do một tham số beta/thinking của mình không (⇒ thử lại bản tối giản)? */
export function loiDoThamSoBeta(thong: string): boolean {
  return /block_binding|context_management|compact|clear_t|fallbacks|output_config|thinking|anthropic-beta|beta|compaction|signature|Extra inputs/i.test(thong);
}

export type MaLoiCongAnthropic =
  | 'CONG_ANTHROPIC_HET_KEY'
  | 'CONG_ANTHROPIC_HONG'
  | 'CONG_ANTHROPIC_HET_HAN_MUC'
  | 'CONG_ANTHROPIC_KHOA';

export class CongAnthropicLoi extends Error {
  constructor(message: string, public readonly code: MaLoiCongAnthropic) {
    super(message);
    this.name = 'CongAnthropicLoi';
  }
}

export type LoaiLoiHttp = 'hetCredit' | 'loi' | 'thuKeKe' | 'tatDinh';

/** Phân loại phản hồi lỗi của Anthropic. Thuần, để test. */
export function phanLoaiLoi(status: number, than: string): LoaiLoiHttp {
  if (status === 402 || /billing_error/i.test(than)) return 'hetCredit';
  if (status === 400 && /credit balance|purchase credits|plans\s*&\s*billing/i.test(than)) return 'hetCredit';
  if (status === 401 || status === 403) return 'loi';
  if (status === 408 || status === 409 || status === 429 || status === 529 || status >= 500) return 'thuKeKe';
  return 'tatDinh';
}

export interface NguCanhGoi {
  userId: number | null;
  /** `language_tutor` (19/10/2026): Trò chuyện cùng CuongMini trong khoá ngoại ngữ — trần $/người/ngày riêng (`ielts/troChuyen`). */
  /** `admin_thong_ke` (23/10/2026): AI thống kê chi tiêu ở trang admin — Sonnet 5.5, chỉ admin gọi, sổ riêng (không ăn trần người dùng). */
  /** `work_ai` (22/10/2026): trợ lý CT Work lùi sang cổng này khi rambo hỏng — trần $/ngày riêng (`services/work/aiCong.ts`). */
  /** `exam_grade` (24/10/2026): chấm bài phòng thi lùi sang cổng này khi rambo hỏng — trần $/ngày riêng (`services/exam/aiChamCong.ts`). */
  viec: 'agent_code' | 'agent_taitro' | 'exam_tutor' | 'thu_ket_noi' | 'tim_web' | 'language_tutor' | 'work_setup' | 'work_ai' | 'admin_thong_ke' | 'exam_grade';
  hang: HangChinhHang;
  model: string;
}

export interface KetQuaGui {
  res: Response;
  key: Pick<KeyDungDuoc, 'id' | 'nhan'>;
  batDau: number;
  ttfbMs: number;
}

/**
 * POST `/v1/messages` với key ưu tiên cao nhất, tự chuyển key theo luật ở đầu
 * file. Trả về `Response` ĐÃ `ok` — người gọi tự đọc luồng rồi gọi `ghiDung`.
 */
export async function guiChinhHang(o: {
  body: Record<string, unknown>;
  signal: AbortSignal;
  nguCanh: NguCanhGoi;
  beta?: string[];
  /**
   * Bản tối giản (không tham số beta) để gửi lại MỘT lần khi 400 nhắc tới một
   * tham số beta/thinking — xem `thanYeuCau.ts › thanAnToan`.
   */
  banAnToan?: () => Record<string, unknown>;
}): Promise<KetQuaGui> {
  const ds = await keyKhaDung();
  if (!ds.length) {
    throw new CongAnthropicLoi(
      'Cổng Claude chính hãng chưa có key nào dùng được (hết credit, hết ngân sách tháng, lỗi hoặc đã tắt).',
      'CONG_ANTHROPIC_HET_KEY',
    );
  }
  const url = `${gocChinhHang()}/v1/messages`;
  let loiCuoi = '';
  let body = o.body;
  let beta = o.beta;
  let daAnToan = false;
  for (let i = 0; i < ds.length; i++) {
    const k = ds[i]!;
    const batDau = Date.now();
    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': k.khoa,
          'anthropic-version': PHIEN_BAN_API,
          ...(beta?.length ? { 'anthropic-beta': beta.join(',') } : {}),
        },
        body: JSON.stringify(body),
        signal: o.signal,
      });
    } catch (err) {
      if (o.signal.aborted) throw err;
      loiCuoi = `mạng: ${(err as Error).message}`;
      await danhDauKey(k.id, 'tamThoi', loiCuoi);
      void ghiDung({ ...o.nguCanh, keyId: k.id, thanhCong: false, maLoi: 'MANG', thoiGianMs: Date.now() - batDau });
      continue;
    }
    if (res.ok && res.body) return { res, key: { id: k.id, nhan: k.nhan }, batDau, ttfbMs: Date.now() - batDau };

    const than = await res.text().catch(() => '');
    const loai = phanLoaiLoi(res.status, than);
    loiCuoi = `HTTP ${res.status} ${than.slice(0, 300)}`;
    void ghiDung({ ...o.nguCanh, keyId: k.id, thanhCong: false, maLoi: `HTTP_${res.status}`, thoiGianMs: Date.now() - batDau });
    if (loai === 'tatDinh') {
      if (o.banAnToan && !daAnToan && loiDoThamSoBeta(than)) {
        /* Một tham số beta (chưa đo được bằng key thật) bị từ chối ⇒ gửi lại
           ĐÚNG key này bằng bản tối giản, một lần. Lỗi do yêu cầu thì key nào cũng thế. */
        logger.warn('[anthropic] 400 vì tham số beta/thinking — gửi lại bản tối giản', { loi: than.slice(0, 200) });
        daAnToan = true;
        body = o.banAnToan();
        beta = [];
        i--;
        continue;
      }
      await danhDauKey(k.id, 'tamThoi', loiCuoi);
      throw new Error(loiCuoi);
    }
    await danhDauKey(k.id, loai === 'thuKeKe' ? 'tamThoi' : loai, loiCuoi);
    logger.warn('[anthropic] key lỗi — thử key kế', { keyId: k.id, status: res.status, loai });
  }
  throw new CongAnthropicLoi(`Mọi key của cổng Claude chính hãng đều lỗi. Lỗi cuối: ${loiCuoi.slice(0, 200)}`, 'CONG_ANTHROPIC_HONG');
}

/** Ghi một dòng sổ. Trả USD đã tính. Không bao giờ ném. */
export async function ghiDung(d: NguCanhGoi & {
  keyId: number | null;
  dung?: DungToken;
  thanhCong: boolean;
  maLoi?: string;
  thoiGianMs: number;
  ttfbMs?: number;
}): Promise<number> {
  const dung = d.dung ?? { input: 0, output: 0, cacheDoc: 0, cacheGhi: 0 };
  const usd = tinhUsd(d.model, dung);
  try {
    await prisma.anthropicUsage.create({
      data: {
        keyId: d.keyId,
        userId: d.userId,
        viec: d.viec,
        hang: d.hang,
        model: d.model,
        inputTokens: dung.input,
        outputTokens: dung.output,
        cacheDocTokens: dung.cacheDoc,
        cacheGhiTokens: dung.cacheGhi,
        costUsd: usd,
        thanhCong: d.thanhCong,
        maLoi: d.maLoi?.slice(0, 60) ?? null,
        thoiGianMs: Math.max(0, Math.round(d.thoiGianMs)),
        ttfbMs: d.ttfbMs !== undefined ? Math.round(d.ttfbMs) : null,
      },
    });
  } catch (err) {
    logger.warn('[anthropic] không ghi được sổ dùng', { error: (err as Error).message });
  }
  return usd;
}

/**
 * Gắn `cache_control` (prompt caching) — tối đa 4 mốc, vị trí ỔN ĐỊNH giữa các vòng:
 *   1. tool cuối (tool hàm đã SẮP theo tên ⇒ thứ tự không phụ thuộc app gửi),
 *   2. cuối system prompt (không có giờ/ngẫu nhiên trong prompt — `prompt.ts`),
 *   3. khối cuối của tin `user` CUỐI (điểm cắt trượt),
 *   4. khối cuối của tin `user` KẾ CUỐI — vòng sau vẫn đọc trúng tiền tố của
 *      vòng trước kể cả khi một vòng nối thêm nhiều khối (cửa sổ dò 20 khối).
 * Vòng lặp agent gửi lại TOÀN BỘ ngữ cảnh mỗi bước nên phần đọc đệm (×0,1
 * giá, Opus 5.5 ×0,05) là chỗ tiết kiệm lớn nhất mà không mất chất lượng.
 *
 * `giuAssistantCuoi` = false (mặc định): tin cuối là `assistant` (viết tiếp
 * kiểu prefill — model 5.5 TỪ CHỐI prefill bằng 400) ⇒ thêm tin `user` xin
 * viết tiếp. `true` khi tiếp một lượt `pause_turn` của server tool (đó là
 * cách Anthropic yêu cầu tiếp).
 */
export function ganCache(body: {
  system?: unknown;
  tools?: Array<Record<string, unknown>>;
  messages: Array<{ role: string; content: unknown }>;
}, giuAssistantCuoi = false): void {
  const DAU = { type: 'ephemeral' };
  if (typeof body.system === 'string' && body.system) {
    body.system = [{ type: 'text', text: body.system, cache_control: DAU }];
  }
  if (Array.isArray(body.tools) && body.tools.length) {
    body.tools[body.tools.length - 1] = { ...body.tools[body.tools.length - 1], cache_control: DAU };
  }
  if (body.messages.at(-1)?.role === 'assistant' && !giuAssistantCuoi) {
    body.messages.push({ role: 'user', content: 'Viết tiếp ĐÚNG chỗ đang dở ở trên, không lặp lại phần đã viết.' });
  }
  let soMoc = 0;
  for (let i = body.messages.length - 1; i >= 0 && soMoc < 2; i--) {
    const tin = body.messages[i]!;
    if (tin.role !== 'user') continue;
    if (typeof tin.content === 'string') {
      if (!tin.content) continue;
      tin.content = [{ type: 'text', text: tin.content, cache_control: DAU }];
      soMoc++;
      continue;
    }
    if (!Array.isArray(tin.content)) continue;
    for (let j = tin.content.length - 1; j >= 0; j--) {
      const kh = tin.content[j] as Record<string, unknown>;
      if (kh && ['text', 'tool_result', 'image', 'document'].includes(String(kh.type))) {
        tin.content[j] = { ...kh, cache_control: DAU };
        soMoc++;
        break;
      }
    }
  }
}
