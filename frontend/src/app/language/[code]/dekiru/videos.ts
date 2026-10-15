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

export const VIDEO_NEO: VideoNeoMap = {
  "b4-hoi-thoai": {
    "dau-bai": [
      { id: "jp-b4-0", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/06-bai-4/06-01-hoi-thoai-que-ban-o-dau-8492d09e.mp4", tieuDe: "Hội thoại Bài 4: quê bạn ở đâu, là nơi thế nào", thoiLuongGiay: 707 },
    ],
  },
  "b4-tu-vung": {
    "dau-bai": [
      { id: "jp-b4-tv1", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/06-bai-4/06-02-tu-vung-huong-tau-xe-canh-vat-f40d7ac6.mp4", tieuDe: "Từ vựng Bài 4 (1): phương hướng, tàu xe, cảnh vật", thoiLuongGiay: 568 },
    ],
    "#5. Tính từ đuôi い": [
      { id: "jp-b4-tv2", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/06-bai-4/06-03-tu-vung-tinh-tu-thoi-tiet-mui-vi-cd6664b4.mp4", tieuDe: "Từ vựng Bài 4 (2): tính từ, thời tiết, mùi vị", thoiLuongGiay: 635 },
    ],
  },
  "b4-ngu-phap": {
    "#ポイント 24": [
      { id: "jp-b4-chia", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/06-bai-4/06-04-bang-chia-tinh-tu-i-na-8d8bd196.mp4", tieuDe: "Bảng chia tính từ đuôi i và đuôi na: khẳng định, phủ định", thoiLuongGiay: 468 },
    ],
    "#ポイント 25": [
      { id: "jp-b4-p1", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/06-bai-4/06-05-diem-24-27-ta-noi-chon-mua-muc-do-53e16156.mp4", tieuDe: "Điểm 24–27: tả nơi chốn, tính từ trước danh từ, mùa, rất – hơi – không lắm", thoiLuongGiay: 636 },
    ],
    "#ポイント 28": [
      { id: "jp-b4-p2", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/06-bai-4/06-06-diem-28-31-co-gi-o-dau-bao-lau-7cac9d25.mp4", tieuDe: "Điểm 28–31: ở đâu có gì, nằm ở đâu, đi bao lâu, bằng gì", thoiLuongGiay: 679 },
    ],
    "#ポイント 32": [
      { id: "jp-b4-p3", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/06-bai-4/06-07-diem-32-36-the-nao-va-nhung-nhi-e7b06d0c.mp4", tieuDe: "Điểm 32–36: như thế nào, thấy sao, và, nhưng, nhỉ", thoiLuongGiay: 564 },
    ],
  },
  "b4-han-lop": {
    "dau-bai": [
      { id: "jp-b4-kj", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/06-bai-4/06-08-chu-han-lop-bai-4-c24d5f47.mp4", tieuDe: "Chữ Hán của lớp Bài 4: Đông, Kinh, Quốc, Khu, Thị, Danh, Tiền, Nam, Nữ", thoiLuongGiay: 552 },
    ],
  },
  "b4-noi": {
    "dau-bai": [
      { id: "jp-b4-noi", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/06-bai-4/06-09-noi-gioi-thieu-que-toi-cau-thi-dcb60b03.mp4", tieuDe: "Luyện nói: giới thiệu quê tôi và câu hỏi thi Bài 4", thoiLuongGiay: 488 },
    ],
  },
};
