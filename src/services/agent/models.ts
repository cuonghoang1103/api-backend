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
/*
 * ⚠️ TÊN HIỂN THỊ không bao giờ là tên thật (19/10/2026): bảng dưới chỉ là BÍ DANH của mã cũ. Thứ app thấy là nhóm
 * "CuongMini Classic" trong `bangModel.ts` (Classic Optimum / Sonic / Heshin) — tên CuongMini, mã `cm-classic-*`.
 */
export interface ModelAgent {
  /** Mã CŨ app ≤ 0.5.200 gửi lên (z.enum cố định). Chỉ còn là bí danh. */
  id: string;
  /** Tên thật gửi cho cổng rambo — KHÔNG BAO GIỜ trả cho app. */
  model: string;
  /** Mục `cm-classic-*` của `bangModel.ts` mà mã cũ này trỏ tới. */
  classic: 'cm-classic-optimum' | 'cm-classic-sonic' | 'cm-classic-heshin';
}

/*
 * ============================================================
 * BẢNG CỔNG RAMBO (rambo.ai.vn) — MÃ CŨ ⇒ NHÓM CUONGMINI CLASSIC
 * ============================================================
 *
 * 18/10/2026 rambo bị tắt (hỏng thật); 19/10/2026 chủ app báo đã chạy lại ⇒ bật bằng công tắc admin, và rambo
 * thành MẶC ĐỊNH ("CuongMini Default", gói trả trọn — rẻ nhất). Bảng model cũ 8 dòng (Cuong Sonnet 5, CuongMini
 * Max 4.8… — LỘ tên thật) thay bằng 3 mục Classic trong `bangModel.ts`; mã cũ ở đây chỉ còn là bí danh để app cũ
 * (z.enum cố định) vẫn chạy đúng model.
 *
 * Đo 19/10/2026 `GET /api/claude/v1/models` (KHÔNG khoá — danh sách quảng cáo, không chứng minh gọi được): 8 model
 * dưới đây, KHÔNG có `claude-sonnet-5-5`. Máy local không có khoá rambo ⇒ CHƯA gọi thật được từng model; kiểm trên
 * production bằng nút "Thử rambo" ở /admin (Cổng Anthropic → Cổng rambo).
 */
export const MODEL_AGENT_RIENG: readonly ModelAgent[] = Object.freeze([
  {
    id: 'haiku-4-5',
    model: 'claude-haiku-4-5',
    classic: 'cm-classic-heshin',
  },
  {
    id: 'sonnet-4-6',
    model: 'claude-sonnet-4-6',
    classic: 'cm-classic-sonic',
  },
  {
    id: 'sonnet-5',
    model: 'claude-sonnet-5',
    classic: 'cm-classic-sonic',
  },
  {
    id: 'opus-4-6',
    model: 'claude-opus-4-6',
    classic: 'cm-classic-optimum',
  },
  {
    id: 'opus-4-7',
    model: 'claude-opus-4-7',
    classic: 'cm-classic-optimum',
  },
  {
    id: 'opus-4-8',
    model: 'claude-opus-4-8',
    classic: 'cm-classic-optimum',
  },
  {
    id: 'opus-5',
    model: 'claude-opus-5',
    classic: 'cm-classic-optimum',
  },
  {
    /* Fable (×3,5 token) KHÔNG có mục Classic riêng — mã cũ về Classic Optimum (không tự nâng lên model đắt hơn). */
    id: 'fable-5',
    model: 'claude-fable-5',
    classic: 'cm-classic-optimum',
  },
] as ModelAgent[]);

/** Mã cũ của bảng rambo (chỉ còn là bí danh). */
export function laMaRambo(id: unknown): boolean {
  return typeof id === 'string' && MODEL_AGENT_RIENG.some((m) => m.id === id);
}
