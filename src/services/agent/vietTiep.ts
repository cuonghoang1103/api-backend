/**
 * ============================================================
 * VIẾT TIẾP KHI CHẠM TRẦN TOKEN
 * ============================================================
 *
 * Đo thật trên cổng modelapi 19/08/2026, gọi `claude-sonnet-5` với
 * `max_tokens: 24`:
 *
 *     finish_reason: length
 *     chữ: "```\nPython - Ngôn ngữ đa năng,"      ← cụt giữa câu
 *
 * Cổng CÓ gửi `finish_reason`. Mã agent thì KHÔNG đọc trường đó ở đâu cả —
 * nó chỉ nhìn `delta`. Nên một câu trả lời bị cắt vì chạm trần được trình ra
 * hệt như một câu trả lời đã viết xong: không lỗi, không cảnh báo, chỉ là
 * chữ dừng giữa chừng. Đây là thứ người dùng báo 19/08 ("quét xong nó bị
 * ngắt, và gián đoạn").
 *
 * ─── VIẾT TIẾP BẰNG PREFILL ───
 * Đặt phần đang dở làm tin nhắn `assistant` CUỐI CÙNG rồi gọi lại: cổng nhận,
 * và model viết tiếp đúng chỗ. Đo thật (đếm 1→30, `max_tokens: 40`):
 *
 *     lượt 1 → "…6 - sáu\n7 "          finish=length
 *     lượt 2 → "7 - bảy\n8 - tám\n…"
 *
 * ⚠️ CHÚ Ý CHỖ CHỒNG LẤN. Lượt 1 dừng giữa mục "7", lượt 2 viết LẠI cả mục
 * đó. Nối thẳng hai chuỗi ra `"7 7 - bảy"`. Đây là lý do file này tồn tại:
 * việc gộp KHÔNG phải phép cộng chuỗi, và nó phải có bộ kiểm riêng vì một
 * lỗi ở đây làm hỏng đúng thứ ta đang cố sửa.
 */

/** Chồng lấn dài nhất ta chịu dò. Dài hơn nữa thì đó là model viết lại cả đoạn, không phải nối tiếp. */
const TOI_DA_CHONG = 200;

/**
 * Gộp phần đã viết với phần viết tiếp, bỏ đoạn model lặp lại.
 *
 * Cách làm: tìm HẬU TỐ dài nhất của `daCo` mà cũng là TIỀN TỐ của `moi`. Đó
 * chính là đoạn model đã viết lại. Ưu tiên đoạn dài nhất — dò từ ngắn lên sẽ
 * dừng ở một trùng hợp một ký tự (`"7"`) và vẫn để lại chữ thừa.
 */
export function gopVietTiep(daCo: string, moi: string): string {
  if (!daCo) return moi;
  if (!moi) return daCo;

  const tran = Math.min(TOI_DA_CHONG, daCo.length, moi.length);
  for (let n = tran; n > 0; n -= 1) {
    if (daCo.endsWith(moi.slice(0, n))) return daCo + moi.slice(n);
  }
  return daCo + moi;
}

/**
 * Câu nhắc kèm khi bảo model viết tiếp.
 *
 * KHÔNG dùng cho tuyến prefill (ở đó chính tin nhắn assistant dở đã là lời
 * nhắc). Dành cho trường hợp cổng từ chối prefill và ta phải hỏi bằng lời.
 */
export const NHAC_VIET_TIEP =
  'Viết tiếp đúng chỗ đang dở. Đừng chào lại, đừng tóm tắt lại phần đã viết.';

/**
 * Chạm trần token bao nhiêu lần thì thôi.
 *
 * 3 là đủ cho `MAX_OUTPUT_TOKENS` hiện tại: 4 lượt × 16k = 64k token ra cho
 * MỘT câu trả lời, dài hơn mọi thứ người đọc sẽ đọc hết. Không giới hạn thì
 * một model kẹt trong vòng lặp tự lặp sẽ đốt sạch hạn mức mà không ai thấy.
 */
export const MAX_VIET_TIEP = 3;
