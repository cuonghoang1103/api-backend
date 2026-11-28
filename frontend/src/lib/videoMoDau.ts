/**
 * Video ở đầu trang giới thiệu khoá.
 *
 * 1) PHIM GIỚI THIỆU (28/11/2026, user duyệt khuôn): 2–5 phút "như phim" — người dùng gặp sự cố → xuyên vào hệ thống →
 *    đội dev (Cường/Lan/Mai) xử lý bằng số đo thật → khoá học dạy gì → web thật → cả nhóm nói "Muốn học thì lên
 *    cuongthai.com nhé!". Dựng ở ~/Documents/video-bai-giang/trailer-khoa (khuon/ghep4.mjs), đẩy R2 bằng
 *    `npx tsx scripts/phim-khoa-len-r2.mts <phim.mp4> <slug>` ⇒ hoc/veo/phim/<slug>.{mp4,jpg}. Thêm slug vào PHIM.
 *    Có tiếng ⇒ KHÔNG tự phát; preload none (55 MB) — chỉ tải khi người xem bấm.
 * 2) Clip 8 s cũ (Veo, hoc/veo/mo-dau/) — TẮT: user thấy "không hiểu gì, như ngắt cụt".
 */
const GOC_PHIM = 'https://media.cuongthai.com/hoc/veo/phim/';

/** slug ⇒ thời lượng (phút, làm tròn) hiện trên nhãn. */
const PHIM: Record<string, number> = {
  postgresql: 4,
};

export interface PhimKhoa { src: string; poster: string; phut: number }

export function phimKhoa(slug: string): PhimKhoa | null {
  const phut = PHIM[slug];
  return phut ? { src: `${GOC_PHIM}${slug}.mp4`, poster: `${GOC_PHIM}${slug}.jpg`, phut } : null;
}
