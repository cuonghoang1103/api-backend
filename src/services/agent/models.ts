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
 *   claude-sonnet-5   14,0s · 1,2326 · trả lời đúng
 *   gpt-5.6-sol       22,2s · 1,4508 · trả lời đúng
 *   claude-opus-4-8   17,2s · 2,7960 · trả lời đúng
 *   gpt-5.6-terra     34,9s · 2,5782 · trả lời đúng
 *
 * ⚠️ CON SỐ CỦA GPT PHỤ THUỘC MẠNH VÀO TẢI, và đó chính là lý do danh sách
 * này khép kín. Một lượt đo sớm hơn (chạy chồng lên phép đo khác) cho
 * `gpt-5.6-sol` 984 token vào và 1,45 tiền; lượt đo sạch cho 19.173 token vào
 * và 13,49 — gấp mười một lần. Chênh lệch nằm ở TOKEN VÀO, tức ở phần cổng tự
 * bọc quanh yêu cầu, chứ không ở câu hỏi. Trong một vòng lặp gọi tool thì phần
 * bọc đó nhân lên theo số vòng.
 */
import { goiDuocModel } from '../llm/gateway.js';

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
    mo: 'Mặc định — nhanh nhất và rẻ nhất trong ba (đo: 14,0s mỗi việc)',
  },
  {
    id: 'opus-4-8',
    model: 'claude-opus-4-8',
    ten: 'Claude Opus 4.8',
    mo: 'Mạnh nhất, đắt gấp 2,3 lần và chậm hơn 23% — để dành cho việc khó',
  },
  {
    id: 'gpt-sol',
    model: 'gpt-5.6-sol',
    ten: 'GPT 5.6 Sol',
    mo: 'Của nhà khác — chậm hơn 59%, đắt hơn 18%; dùng khi muốn ý kiến thứ hai',
  },
]);

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
  const ma = typeof id === 'string' && id ? id : MODEL_AGENT_MAC_DINH;
  const m = MODEL_AGENT.find((x) => x.id === ma) ?? MODEL_AGENT.find((x) => x.id === MODEL_AGENT_MAC_DINH)!;
  if (!goiDuocModel(m.model)) return null;
  return { model: m.model, id: m.id };
}

/** Danh sách cho app vẽ giao diện — kèm cờ nói model nào đang gọi được thật. */
export function dsModelAgent(): Array<ModelAgent & { dungDuoc: boolean }> {
  return MODEL_AGENT.map((m) => ({ ...m, dungDuoc: goiDuocModel(m.model) }));
}
