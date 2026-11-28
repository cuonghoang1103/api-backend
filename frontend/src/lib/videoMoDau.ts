/**
 * Clip mở đầu 8 giây cho từng khoá (28/11/2026) — tạo bằng Veo (gói Google AI Ultra của chủ web, qua app Gemini),
 * lưu R2 `hoc/veo/mo-dau/<slug>.mp4`. Hiện ở đầu trang giới thiệu khoá (tự phát, không tiếng, lặp).
 * Thêm khoá mới: tạo clip ⇒ đẩy R2 đúng đường dẫn ⇒ thêm slug vào đây.
 */
const GOC = 'https://media.cuongthai.com/hoc/veo/mo-dau/';
// 28/11: TẠM TẮT — user xem thử: clip 8 s đứng riêng "không hiểu gì, như ngắt cụt", thiếu ý nghĩa. Bật lại khi có bản
// "trailer" 30–60 s (nhiều cảnh Veo nối liền + lời đọc giải thích khoá học dạy gì + phụ đề). Clip thô vẫn ở R2 hoc/veo/mo-dau/.
const CO_CLIP = new Set<string>([]);

export function videoMoDau(slug: string): string | null {
  return CO_CLIP.has(slug) ? `${GOC}${slug}.mp4` : null;
}
