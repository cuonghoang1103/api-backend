/**
 * Clip mở đầu 8 giây cho từng khoá (28/11/2026) — tạo bằng Veo (gói Google AI Ultra của chủ web, qua app Gemini),
 * lưu R2 `hoc/veo/mo-dau/<slug>.mp4`. Hiện ở đầu trang giới thiệu khoá (tự phát, không tiếng, lặp).
 * Thêm khoá mới: tạo clip ⇒ đẩy R2 đúng đường dẫn ⇒ thêm slug vào đây.
 */
const GOC = 'https://media.cuongthai.com/hoc/veo/mo-dau/';
const CO_CLIP = new Set(['postgresql', 'introduction-to-databases', 'nodejs', 'docker', 'git', 'react']);

export function videoMoDau(slug: string): string | null {
  return CO_CLIP.has(slug) ? `${GOC}${slug}.mp4` : null;
}
