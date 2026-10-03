/**
 * ============================================================
 * /compact — NGƯỜI DÙNG CHỦ ĐỘNG TÓM TẮT PHẦN CŨ (03/10/2026)
 * ============================================================
 *
 * `tomTatLuotCu.ts` chỉ chạy khi hội thoại đã CHẠM trần 600k và máy chủ buộc
 * phải bỏ lượt cũ. Lệnh `/compact` của AI Code (app desktop) làm việc đó SỚM,
 * theo ý người dùng: tóm tắt mọi lượt trừ vài lượt cuối thành một bản ghi nhớ,
 * app thay phần cũ bằng bản ghi nhớ đó trong hội thoại GỬI LÊN (bản đầy đủ vẫn
 * nằm trên màn hình để người dùng cuộn đọc).
 *
 * Dùng LẠI `ghiNhoLuotDaBo` — cùng prompt, cùng model rẻ, cùng đệm theo băm —
 * nên lượt sau mà máy chủ tự cắt đúng phần đó thì trúng đệm, không gọi lại.
 *
 * ⛔ Đơn vị là LƯỢT (một `user` + mọi thứ theo sau), giống `catCu.ts`: cắt lẻ
 * một tin `tool` là làm mồ côi `tool_call` của nó và cổng từ chối cả lượt.
 */
import type { AgentMessage } from './turn.js';
import { ghiNhoLuotDaBo } from './tomTatLuotCu.js';

/** Mặc định giữ nguyên văn 2 lượt cuối — agent cần chúng để biết đang làm gì. */
export const GIU_LUOT_MAC_DINH = 2;
const GIU_LUOT_TOI_DA = 20;
/** Trần số tin nhắn nhận — khớp trần 200 lượt × vài tin của `turn.ts`, nới rộng. */
const TRAN_TIN = 4_000;
const TRAN_CHU_MOT_TIN = 400_000;
const TRAN_GHI_CHU = 500;

export class CompactLoi extends Error {
  constructor(message: string, readonly code: string, readonly status: number) {
    super(message);
  }
}

function laChuoi(v: unknown): v is string {
  return typeof v === 'string';
}

/**
 * Lọc thân yêu cầu thành `AgentMessage[]` hợp hình dạng.
 *
 * Không tin app: một tin sai hình dạng (thiếu `function.arguments`) là
 * `ghiNhoLuotDaBo` nổ ở `.slice` giữa chừng. Ảnh bị bỏ — bản tóm tắt chỉ cần
 * biết "có ảnh", và `chuCua` đã đổi khối ảnh thành `[ảnh]`.
 */
export function chuanHoaTin(dauVao: unknown): AgentMessage[] {
  if (!Array.isArray(dauVao)) throw new CompactLoi('Thiếu "messages"', 'BAD_MESSAGES', 400);
  if (dauVao.length > TRAN_TIN) throw new CompactLoi('Hội thoại quá dài', 'BAD_MESSAGES', 400);
  const ra: AgentMessage[] = [];
  for (const m of dauVao) {
    if (!m || typeof m !== 'object') continue;
    const o = m as Record<string, unknown>;
    if (o.role === 'user') {
      if (laChuoi(o.content)) ra.push({ role: 'user', content: o.content.slice(0, TRAN_CHU_MOT_TIN) });
      else if (Array.isArray(o.content)) {
        const chu = o.content
          .map((k) => (k && typeof k === 'object' && (k as { type?: unknown }).type === 'text'
            && laChuoi((k as { text?: unknown }).text) ? (k as { text: string }).text : '[ảnh]'))
          .join('\n');
        ra.push({ role: 'user', content: chu.slice(0, TRAN_CHU_MOT_TIN) });
      }
    } else if (o.role === 'assistant') {
      const calls = Array.isArray(o.tool_calls)
        ? o.tool_calls
          .filter((c): c is { id: string; function: { name: string; arguments: string } } => {
            const f = (c as { function?: { name?: unknown; arguments?: unknown } } | null)?.function;
            return !!c && laChuoi((c as { id?: unknown }).id) && !!f && laChuoi(f.name) && laChuoi(f.arguments);
          })
          .map((c) => ({
            id: c.id, type: 'function' as const,
            function: { name: c.function.name, arguments: c.function.arguments.slice(0, TRAN_CHU_MOT_TIN) },
          }))
        : [];
      ra.push({
        role: 'assistant',
        content: laChuoi(o.content) ? o.content.slice(0, TRAN_CHU_MOT_TIN) : null,
        ...(calls.length ? { tool_calls: calls } : {}),
      });
    } else if (o.role === 'tool' && laChuoi(o.tool_call_id)) {
      ra.push({
        role: 'tool', tool_call_id: o.tool_call_id,
        content: laChuoi(o.content) ? o.content.slice(0, TRAN_CHU_MOT_TIN) : '',
      });
    }
  }
  return ra;
}

/**
 * Chỉ số tin nhắn nơi PHẦN GIỮ NGUYÊN bắt đầu: đầu lượt thứ `giuLuot` tính từ
 * cuối. `0` = không có gì để gộp (hội thoại ngắn hơn số lượt giữ + 1).
 */
export function diemCat(messages: readonly AgentMessage[], giuLuot: number): number {
  const moc: number[] = [];
  messages.forEach((m, i) => { if (m.role === 'user') moc.push(i); });
  if (moc.length <= giuLuot) return 0;
  return moc[moc.length - giuLuot]!;
}

export interface KetQuaCompact {
  /** Bản tóm tắt phần cũ; `null` khi không có gì để gộp. */
  tomTat: string | null;
  /** Đề bài (tin đầu của người dùng) đã ghim — app đặt nó trên bản tóm tắt. */
  deBai: string | null;
  /** Số tin nhắn ĐẦU hội thoại đã được gộp vào bản tóm tắt. */
  soTinDaGop: number;
  soLuotDaGop: number;
  /** Có phải gọi model không (trúng đệm thì không). */
  daGoiModel: boolean;
}

export async function compactChuDong(
  messagesTho: unknown,
  tuyChon: { giuLuot?: unknown; ghiChu?: unknown } = {},
): Promise<KetQuaCompact> {
  const messages = chuanHoaTin(messagesTho);
  const giu = typeof tuyChon.giuLuot === 'number' && Number.isFinite(tuyChon.giuLuot)
    ? Math.min(GIU_LUOT_TOI_DA, Math.max(1, Math.floor(tuyChon.giuLuot)))
    : GIU_LUOT_MAC_DINH;
  const ghiChu = laChuoi(tuyChon.ghiChu) && tuyChon.ghiChu.trim()
    ? tuyChon.ghiChu.trim().slice(0, TRAN_GHI_CHU)
    : undefined;

  const cat = diemCat(messages, giu);
  if (cat === 0) {
    return { tomTat: null, deBai: null, soTinDaGop: 0, soLuotDaGop: 0, daGoiModel: false };
  }
  const soLuotDaGop = messages.slice(0, cat).filter((m) => m.role === 'user').length;
  const g = await ghiNhoLuotDaBo(messages, messages.length - cat, ghiChu);
  if (!g.tomTat) {
    throw new CompactLoi('Không tóm tắt được lúc này (cổng AI không trả lời). Thử lại sau ít phút.', 'COMPACT_HONG', 502);
  }
  return { tomTat: g.tomTat, deBai: g.deBai, soTinDaGop: cat, soLuotDaGop, daGoiModel: g.daGoiModel };
}
