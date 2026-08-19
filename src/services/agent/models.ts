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
import { congAgent, goiDuocModel } from '../llm/gateway.js';

export interface ModelAgent {
  /** Mã app gửi lên. Ngắn, không đổi khi nhà cung cấp đổi tên model. */
  id: string;
  /** Tên thật gửi cho cổng. */
  model: string;
  ten: string;
  /** Một dòng cho giao diện — nói bằng thứ đo được, không bằng tính từ. */
  mo: string;
}

export const MODEL_AGENT: readonly ModelAgent[] = Object.freeze([
  {
    id: 'sonnet-5',
    model: 'claude-sonnet-5',
    ten: 'Claude Sonnet 5',
    mo: 'Mặc định — rẻ nhất, đo 1,76 mỗi việc trên vòng lặp gọi tool',
  },
  {
    id: 'opus-4-8',
    model: 'claude-opus-4-8',
    ten: 'Claude Opus 4.8',
    mo: 'Mạnh nhất — đắt gấp 2,3 lần (4,07/việc). Để dành việc khó',
  },
  {
    id: 'gpt-sol',
    model: 'gpt-5.6-sol',
    ten: 'GPT 5.6 Sol',
    mo: 'Nhà khác — ĐẮT GẤP 7,3 LẦN (12,77/việc). Chỉ khi cần ý kiến thứ hai',
  },
]);

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
    ten: 'Claude Haiku 4.5',
    mo: 'Nhẹ nhất — việc vặt, sửa một file, hỏi nhanh',
  },
  {
    id: 'sonnet-4-6',
    model: 'claude-sonnet-4-6',
    ten: 'Claude Sonnet 4.6',
    mo: 'Nhanh nhất trong đo thật (2,4s tới chữ đầu) — việc thường ngày',
  },
  {
    id: 'sonnet-5',
    model: 'claude-sonnet-5',
    ten: 'Claude Sonnet 5',
    mo: 'MẶC ĐỊNH — cân bằng nhất giữa nhanh và giỏi',
  },
  {
    id: 'opus-4-6',
    model: 'claude-opus-4-6',
    ten: 'Claude Opus 4.6',
    mo: 'Nặng — việc cần suy luận nhiều bước',
  },
  {
    id: 'opus-4-7',
    model: 'claude-opus-4-7',
    ten: 'Claude Opus 4.7',
    mo: 'Nặng hơn — refactor lớn, đọc cả kiến trúc',
  },
  {
    id: 'opus-4-8',
    model: 'claude-opus-4-8',
    ten: 'Claude Opus 4.8',
    mo: 'Nặng nhất (4,7s tới chữ đầu) — để dành việc khó nhất',
  },
]);

/**
 * Bảng đang hiệu lực.
 *
 * Cắm cổng riêng thì dùng bảng 6 model của nó; không cắm thì về bảng cũ của
 * modelapi. Một hàm chứ không phải hằng số: `AGENT_GATEWAY_*` đọc từ môi
 * trường, và môi trường chỉ có thật lúc CHẠY.
 */
function bangHienHanh(): readonly ModelAgent[] {
  return congAgent() ? MODEL_AGENT_RIENG : MODEL_AGENT;
}

/**
 * Model này gọi được không?
 *
 * Cổng riêng phục vụ TRỌN bảng của nó (đo thật cả 6, đều 200 và gọi tool
 * đúng), nên không phải tra khoá theo nhóm như ở modelapi — chuyện "một token
 * thuộc đúng một nhóm" là đặc thù của cổng kia.
 */
function goiDuoc(model: string): boolean {
  return congAgent() ? true : goiDuocModel(model);
}

/** Mã mặc định. Cũng là thứ dùng khi app gửi mã lạ hoặc không gửi gì. */
export const MODEL_AGENT_MAC_DINH = 'sonnet-5';

/**
 * Mã → tên model thật.
 *
 * Trả về `null` khi nhóm của model đó CHƯA CẮM KHOÁ, thay vì trả tên rồi để
 * lời gọi chết bằng `503`. Người dùng chọn GPT trên máy mà VPS chưa có khoá
 * GPT là chuyện sẽ xảy ra — lúc đó phải nói được "chưa cắm khoá", chứ không
 * phải "cổng đang bận".
 */
export function modelAgentTu(id: unknown): { model: string; id: string } | null {
  const bang = bangHienHanh();
  const ma = typeof id === 'string' && id ? id : MODEL_AGENT_MAC_DINH;
  // Mã lạ (app cũ gửi `gpt-sol` trong khi đã chuyển cổng) rơi về mặc định
  // thay vì lỗi — người dùng không nên phải cài lại app mới hỏi được.
  const m = bang.find((x) => x.id === ma) ?? bang.find((x) => x.id === MODEL_AGENT_MAC_DINH) ?? bang[0]!;
  if (!goiDuoc(m.model)) return null;
  return { model: m.model, id: m.id };
}

/** Danh sách cho app vẽ giao diện — kèm cờ nói model nào đang gọi được thật. */
export function dsModelAgent(): Array<ModelAgent & { dungDuoc: boolean }> {
  return bangHienHanh().map((m) => ({ ...m, dungDuoc: goiDuoc(m.model) }));
}
