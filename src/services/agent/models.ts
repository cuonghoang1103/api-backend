/**
 * ============================================================
 * MODEL CHO AGENT LẬP TRÌNH — DANH SÁCH TRẮNG
 * ============================================================
 *
 * ─── VÌ SAO DANH SÁCH TRẮNG, KHÔNG PHẢI CHUỖI TỰ DO ───
 * App gửi lên tên model người dùng chọn. Nếu máy chủ cứ thế chuyển tiếp cho
 * cổng thì bất kỳ ai sửa được gói tin đều gọi được MỌI model của mọi nhóm —
 * kể cả model đắt gấp mười — và hoá đơn là của chủ web, không phải của họ.
 * Nên app gửi một cái MÃ NGẮN, còn tên model thật chỉ tồn tại ở đây.
 *
 * ─── VÌ SAO CHỈ BA ───
 * Đo thật 18/08/2026 trên đúng vòng lặp gọi tool của agent (cùng câu hỏi, 4
 * vòng, 3 lời gọi tool, kho mã giả cố định để mọi model đi qua cùng lượng dữ
 * liệu):
 *
 *   claude-sonnet-5   1,23 · 2,28 · 1,77  ⇒ TB 1,76   · vào ~3.700 token
 *   gpt-5.6-terra     2,58 · 3,05 · 2,78  ⇒ TB 2,80   · vào ~15.800
 *   claude-opus-4-8   3,70 · 2,80 · 5,73  ⇒ TB 4,07   · vào ~3.600
 *   gpt-5.6-sol      13,49 ·13,21 ·11,59  ⇒ TB 12,77  · vào ~19.200
 *
 * Cả bốn trả lời ĐÚNG, độ trễ nay xấp xỉ nhau (10–25s) nên tốc độ không phải
 * thứ để chọn. Thứ để chọn là cột TOKEN VÀO: model GPT mang gấp năm lần token
 * vào cho CÙNG một câu hỏi, vì cổng tự bọc chúng trong một prompt ẩn. Trong
 * vòng lặp gọi tool, phần bọc đó nhân theo số vòng — nên chênh lệch 5× ở token
 * thành 7,3× ở tiền.
 *
 * ⚠️ CON SỐ CỦA GPT PHỤ THUỘC MẠNH VÀO TẢI, và đó chính là lý do danh sách
 * này khép kín. Một lượt đo sớm hơn (chạy chồng lên phép đo khác) cho
 * `gpt-5.6-sol` 984 token vào và 1,45 tiền; lượt đo sạch cho 19.173 token vào
 * và 13,49 — gấp mười một lần. Chênh lệch nằm ở TOKEN VÀO, tức ở phần cổng tự
 * bọc quanh yêu cầu, chứ không ở câu hỏi. Trong một vòng lặp gọi tool thì phần
 * bọc đó nhân lên theo số vòng.
 */
import { congAgent } from '../llm/gateway.js';

/*
 * ⚠️ TÊN HIỂN THỊ là thương hiệu riêng (25/09/2026, người dùng yêu cầu): Haiku →
 * "Cuong Haiku", Sonnet → "Cuong Sonnet", Opus → "CuongMini Max", số phiên bản
 * giữ nguyên — để không trùng tên Claude của Anthropic. Chỉ `ten` đổi; `id` và
 * `model` (tên thật gửi cổng) giữ nguyên.
 */
export interface ModelAgent {
  /** Mã app gửi lên. Ngắn, không đổi khi nhà cung cấp đổi tên model. */
  id: string;
  /** Tên thật gửi cho cổng. */
  model: string;
  ten: string;
  /** Một dòng cho giao diện — nói bằng thứ đo được, không bằng tính từ. */
  mo: string;
  /**
   * Model ĐẮT bất thường ⇒ app hiện cảnh báo trước khi dùng, và máy chủ áp hạn
   * mức riêng (`fable.ts`). Chỉ `claude-fable-5` có cờ này (26/09/2026).
   */
  dat?: boolean;
}

/*
 * 18/10/2026: bảng modelapi cũ (`sonnet-5` / `opus-4-8` / `gpt-sol`) đã thay bằng
 * bảng CuongMini chung ở `bangModel.ts`. File này chỉ còn bảng của CỔNG RAMBO —
 * dùng khi admin BẬT lại rambo (`ramboBat()`), mặc định TẮT.
 */

/**
 * ============================================================
 * BẢNG MODEL KHI CHẠY QUA CỔNG RIÊNG (rambo.ai.vn)
 * ============================================================
 *
 * Cổng riêng của người dùng bán 6 model Claude, và họ nói rõ "cứ dùng thoải
 * mái, chất lượng là được" — nên bảng này xếp theo NẶNG DẦN chứ không theo
 * tiền. Số trong `mo` là ĐO THẬT 19/08/2026 trên đúng đường thật, mỗi model
 * một lời gọi có kèm tool: thời gian tới mẩu chữ đầu tiên.
 *
 * ⚠️ KHÔNG chép bảng giá của modelapi sang đây. Hai cổng khác nhà, khác cách
 * bọc prompt; con số "đắt gấp 7,3 lần" của `gpt-5.6-sol` chỉ đúng ở cổng kia.
 * Cổng này không có model GPT nào.
 */
const MODEL_AGENT_RIENG: readonly ModelAgent[] = Object.freeze([
  {
    id: 'haiku-4-5',
    model: 'claude-haiku-4-5',
    ten: 'Cuong Haiku 4.5',
    mo: 'Nhẹ nhất — việc vặt, sửa một file, hỏi nhanh',
  },
  {
    id: 'sonnet-4-6',
    model: 'claude-sonnet-4-6',
    ten: 'Cuong Sonnet 4.6',
    mo: 'Nhanh nhất trong đo thật (2,4s tới chữ đầu) — việc thường ngày',
  },
  {
    id: 'sonnet-5',
    model: 'claude-sonnet-5',
    ten: 'Cuong Sonnet 5',
    mo: 'MẶC ĐỊNH — cân bằng nhất giữa nhanh và giỏi',
  },
  {
    id: 'opus-4-6',
    model: 'claude-opus-4-6',
    ten: 'CuongMini Max 4.6',
    mo: 'Nặng — việc cần suy luận nhiều bước',
  },
  {
    id: 'opus-4-7',
    model: 'claude-opus-4-7',
    ten: 'CuongMini Max 4.7',
    mo: 'Nặng hơn — refactor lớn, đọc cả kiến trúc',
  },
  {
    id: 'opus-4-8',
    model: 'claude-opus-4-8',
    ten: 'CuongMini Max 4.8',
    mo: 'Thế hệ trước (4,7s tới chữ đầu) — nay Max 5 rẻ và tốt hơn',
  },
  {
    id: 'opus-5',
    model: 'claude-opus-5',
    ten: 'CuongMini Max 5',
    mo: 'MỚI — mạnh nhất cho việc thường, rẻ và tốt hơn Max 4.8',
  },
  {
    id: 'fable-5',
    model: 'claude-fable-5',
    ten: 'Cuong Fable 5',
    mo: '⚠ Tốn token GẤP 3,5 LẦN — chỉ dùng cho việc cực khó. Có hạn mức riêng',
    dat: true,
  },
]);

/** Mã có thuộc bảng rambo không (chỉ có nghĩa khi rambo đang bật). */
export function laMaRambo(id: unknown): boolean {
  return typeof id === 'string' && MODEL_AGENT_RIENG.some((m) => m.id === id);
}

/** Mã mặc định của bảng rambo. */
export const MODEL_AGENT_MAC_DINH = 'sonnet-5';

/** Mã rambo ⇒ tên model thật. `null` khi rambo không chạy được (tắt / thiếu cấu hình). */
export function modelAgentTu(id: unknown): { model: string; id: string } | null {
  if (!congAgent()) return null;
  const ma = typeof id === 'string' && id ? id : MODEL_AGENT_MAC_DINH;
  const m = MODEL_AGENT_RIENG.find((x) => x.id === ma) ?? MODEL_AGENT_RIENG.find((x) => x.id === MODEL_AGENT_MAC_DINH)!;
  return { model: m.model, id: m.id };
}

/** Bảng rambo cho app — chỉ khi rambo bật. */
export function dsModelRambo(): Array<ModelAgent & { dungDuoc: boolean }> {
  return congAgent() ? MODEL_AGENT_RIENG.map((m) => ({ ...m, dungDuoc: true })) : [];
}
