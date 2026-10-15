/**
 * 🎬 Video bài giảng tiếng Nhật (mp4 tự làm trên R2) gắn vào ĐÚNG MỤC của bài Dekiru.
 *
 * ⚠️ TỆP SINH TỰ ĐỘNG bởi dự án video: `~/Documents/video-bai-giang/xuat/gan-sach.mts`
 * (đọc `~/Videos/CuongThai-KhoaHoc/<khoá>/<chương>/<bài>/thong-tin.json` có `r2Url` + `neo`). Sửa tay sẽ bị
 * ghi đè ở lần gắn sau — muốn đổi chỗ gắn thì sửa `neo` trong thong-tin.json rồi chạy lại.
 *
 * Dạng: `{ [lessonId]: { [neo]: VideoMuc[] } }` (VideoNeoMap, components/sach-hoc/types.ts)
 *  - `lessonId` = id bài, đúng `?bai=…` (vd `b6-ngu-phap`, `b0-hiragana`, `bat-dau`, `de-luyen-b6-7`).
 *  - `neo` = `'dau-bai'` (ngay dưới "Mục tiêu") hoặc `'#<đầu tiêu đề mục>'` (vd `'#ポイント 48'`,
 *    `'#2. Bảng 46 chữ'`, `'#Thể て'`) — video hiện NGAY DƯỚI tiêu đề đó. Đầu bài tự có mục
 *    "🎬 Video của bài" liệt kê mọi video, bấm nhảy tới mục.
 * Không phải đụng tệp nội dung bài (baiN.ts) hay manifest.
 */
import type { VideoNeoMap } from '@/components/sach-hoc/types';

export const VIDEO_NEO: VideoNeoMap = {};
