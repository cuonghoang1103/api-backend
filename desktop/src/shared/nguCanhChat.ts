/**
 * ============================================================
 * NGỮ CẢNH CHO MỘT LƯỢT CHAT
 * ============================================================
 *
 * ⚠️ `POST /api/v1/ai/chat` **KHÔNG nhớ hộ**. Trong `streamChat`
 * (`src/services/ai.service.ts`) mọi chỗ đụng tới `sessionId` đều là GHI;
 * ngữ cảnh model nhận được đến DUY NHẤT từ `sanitizeHistory(context.history)`
 * — tức mảng `history` mà CLIENT gửi lên (`ai.service.ts:1198`).
 *
 * Gửi `sessionId` mà không gửi `history` ⇒ mỗi câu là một cuộc đời mới.
 * Phiên chỉ là nhật ký để hiện lại lịch sử trên màn hình.
 *
 * Người dùng 19/09/2026, kèm ảnh khung chat nhanh của robot: *"sao con AI này
 * không nhớ được tin nhắn cũ vậy… cả 3 model mini, pro và max"*. Đúng — vì nó
 * không phụ thuộc model chút nào: khung nhanh chưa từng gửi `history`.
 *
 * Tệp này là NƠI DUY NHẤT quyết định gửi gì, để ba chỗ gọi (khung nhanh của
 * robot, AI Chat đầy đủ, lượt nói) không mỗi nơi một kiểu — đó chính là cách
 * một chỗ được vá còn hai chỗ kia im lặng hỏng tiếp.
 */

export interface LuotChat {
  vai: 'user' | 'assistant';
  chu: string;
  /** Data URL các ảnh người dùng đính ở ĐÚNG lượt này. */
  anh?: string[] | undefined;
}

/** Số lượt gửi kèm làm ngữ cảnh. Khớp với bản web và AI Chat đầy đủ. */
export const SO_LUOT_NGU_CANH = 10;

/**
 * Tầm nhớ ẢNH — số lượt gần nhất còn coi là "đang làm bài đó".
 *
 * Nhỏ hơn `SO_LUOT_NGU_CANH` có chủ ý: mỗi lần gửi lại ảnh là một lần TRẢ
 * TIỀN cho ảnh đó. 6 đủ để hỏi tiếp vài câu về cùng tấm đề, không đủ để kéo
 * một tấm ảnh cũ đi theo cả cuộc.
 */
export const TAM_NHO_ANH = 6;

/** Tối đa mấy ảnh được kèm lại. */
export const TOI_DA_ANH_KEM_LAI = 2;

/**
 * Lịch sử để gửi lên, dạng CHỮ THUẦN.
 *
 * ⚠️ `luot` phải là danh sách TRƯỚC khi thêm lượt người dùng vừa gõ. Thêm
 * trước rồi mới gọi hàm này thì câu vừa gõ nằm cả trong `history` lẫn trong
 * `message`, và model đọc nó hai lần — nó sẽ trả lời như thể bạn hỏi hai lần.
 */
export function lichSuGui(luot: LuotChat[]): Array<{ role: 'user' | 'assistant'; content: string }> {
  return luot
    .filter((l) => l.chu.trim() !== '')
    .slice(-SO_LUOT_NGU_CANH)
    .map((l) => ({ role: l.vai, content: l.chu }));
}

/**
 * Ảnh thật sự gửi kèm lượt này.
 *
 * Lịch sử lên model là chữ thuần — ảnh chỉ đi kèm đúng lượt người dùng vừa
 * đính. Nên sau khi gửi ảnh đề toán mà hỏi tiếp "câu b thì sao", model KHÔNG
 * CÒN NHÌN THẤY ĐỀ và nó quay ra xin gửi lại ảnh. Đó chính là ảnh người dùng
 * gửi 19/09/2026: *"tôi chỉ gửi lại yêu cầu, ảnh vẫn ở đoạn chat A"*.
 *
 * Chữa: lượt này không đính gì thì tự kèm lại ảnh của lượt có ảnh GẦN NHẤT,
 * miễn là nó còn trong `TAM_NHO_ANH` lượt vừa rồi.
 */
export function anhKemLai(luot: LuotChat[], anhMoi?: string[] | undefined): string[] | undefined {
  if (anhMoi && anhMoi.length > 0) return anhMoi;
  const ganDay = luot.slice(-TAM_NHO_ANH);
  for (let i = ganDay.length - 1; i >= 0; i -= 1) {
    const l = ganDay[i]!;
    if (l.vai === 'user' && l.anh && l.anh.length > 0) return l.anh.slice(0, TOI_DA_ANH_KEM_LAI);
  }
  return undefined;
}

/**
 * Thêm một lượt vào vòng nhớ, cắt bớt phần quá cũ.
 *
 * Giữ gấp đôi `SO_LUOT_NGU_CANH` chứ không đúng bằng: `lichSuGui` cắt lấy 10
 * lượt cuối, còn `anhKemLai` cần nhìn xa hơn một chút để không đánh rơi tấm
 * ảnh ngay khi nó vừa trôi ra khỏi cửa sổ ngữ cảnh.
 */
export function themLuot(luot: LuotChat[], moi: LuotChat): LuotChat[] {
  return [...luot, moi].slice(-SO_LUOT_NGU_CANH * 2);
}
