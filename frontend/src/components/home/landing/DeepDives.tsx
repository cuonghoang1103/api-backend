'use client';

/**
 * Mục "Deep Dives" trên trang chủ — lưới thẻ hướng dẫn dài, mỗi thẻ mang logo
 * công nghệ đúng màu thương hiệu.
 *
 * ─── HAI KIỂU ĐÍCH ──────────────────────────────────────────────────────────
 * Xem `deepDivesData.ts`. Thẻ có `article` mở bài viết dài trong hệ tech-trends;
 * thẻ có `href` dẫn vào nơi site đã dạy sâu chủ đề đó (Code Lab, khoá học, Xưởng
 * mô phỏng). Thẻ kiểu thứ hai hiện thêm một nhãn `via` để người đọc biết mình
 * sắp đi đâu — bấm vào tưởng đọc bài mà lại ra danh sách bài tập thì là lừa.
 *
 * ─── LOGO ───────────────────────────────────────────────────────────────────
 * `<img>` trỏ vào `/logos/<logo>.svg`, TỰ PHỤC VỤ. Bắt buộc: CSP của site đặt
 * `img-src 'self' data:` nên logo lấy từ CDN ngoài bị chặn thẳng.
 * Có `width`/`height` cố định để không gây layout shift (CLS) khi ảnh về.
 *
 * ─── KHÔNG LÀM GÌ Ở ĐÂY ─────────────────────────────────────────────────────
 * Không `hover:scale`, không nhấc thẻ lên, không glow theo màu. Hover chỉ đổi
 * đường viền và màu chữ — cùng luật với phần còn lại của trang chủ, xem chú
 * thích đầu `RiveLanding.tsx`.
 */
// Lưới thẻ cũ (`LegacyDeepDives`) đã gỡ 11/11/2026 — không còn ai gọi. Bản đang chạy: `DeepDivesEditorial.tsx`
// (dữ liệu ở `deepDivesData.ts`). Các luật ở chú thích trên vẫn áp dụng.
export { default } from './DeepDivesEditorial';
