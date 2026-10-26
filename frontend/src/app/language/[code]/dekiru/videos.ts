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
  "s113-b1-01-chao-hoi-ten": {
    "dau-bai": [
      { id: "jp-s113-b1-01", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/03-bai-1/03-01-chao-lan-dau-noi-ten-hoi-ten-9bb5aac4.mp4", tieuDe: "Tự giới thiệu: chào lần đầu, nói tên, hỏi tên", thoiLuongGiay: 561 },
    ],
  },
  "s113-b1-02-nuoc-nguoi": {
    "dau-bai": [
      { id: "jp-s113-b1-02", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/03-bai-1/03-02-ten-nuoc-nguoi-nuoc-nao-khong-phai-6d511c3e.mp4", tieuDe: "Tên nước, người nước nào và cách trả lời không phải", thoiLuongGiay: 537 },
    ],
  },
  "s113-b1-03-truong-nghe": {
    "dau-bai": [
      { id: "jp-s113-b1-03", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/03-bai-1/03-03-truong-hoc-nghe-nghiep-no-d21d4d9e.mp4", tieuDe: "Trường học, nghề nghiệp và trợ từ no: sinh viên của trường nào", thoiLuongGiay: 518 },
    ],
  },
  "s113-b1-04-tuoi-ngay-sinh": {
    "dau-bai": [
      { id: "jp-s113-b1-04", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/03-bai-1/03-04-tuoi-thang-ngay-sinh-nhat-caf3d97b.mp4", tieuDe: "Tuổi, tháng, ngày và hỏi sinh nhật", thoiLuongGiay: 620 },
    ],
  },
  "s113-b1-05-so-thich": {
    "dau-bai": [
      { id: "jp-s113-b1-05", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/03-bai-1/03-05-so-thich-to-mo-giong-nhau-1925ebe6.mp4", tieuDe: "Sở thích, trợ từ to (và) và mo (cũng)", thoiLuongGiay: 458 },
    ],
  },
  "s113-b1-06-tong-hop-noi-han": {
    "dau-bai": [
      { id: "jp-s113-b1-06", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/03-bai-1/03-06-tu-gioi-thieu-day-du-khuon-thi-noi-3054d574.mp4", tieuDe: "Tự giới thiệu đầy đủ bảy câu và khuôn đề thi nói Bài 1", thoiLuongGiay: 596 },
    ],
  },
  "s113-b2-01-noi-chon-toa-nha": {
    "dau-bai": [
      { id: "jp-s113-b2-01", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/04-bai-2/04-01-hoi-cho-toa-nha-tang-may-1ffaa516.mp4", tieuDe: "Hỏi chỗ trong toà nhà: ở đâu, tầng mấy", thoiLuongGiay: 507 },
    ],
  },
  "s113-b2-02-do-vat-gan-xa": {
    "dau-bai": [
      { id: "jp-s113-b2-02", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/04-bai-2/04-02-do-vat-gan-xa-kore-sore-are-14a6f348.mp4", tieuDe: "Chỉ đồ vật: cái này, cái đó, cái kia", thoiLuongGiay: 472 },
    ],
  },
  "s113-b2-03-so-va-gia-tien": {
    "dau-bai": [
      { id: "jp-s113-b2-03", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/04-bai-2/04-03-so-dem-va-gia-tien-e30b88f5.mp4", tieuDe: "Số và giá tiền: đọc hàng chục, trăm, nghìn, vạn và hỏi bao nhiêu tiền", thoiLuongGiay: 597 },
    ],
  },
  "s113-b2-04-sieu-thi-mua-do": {
    "dau-bai": [
      { id: "jp-s113-b2-04", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/04-bai-2/04-04-sieu-thi-wo-kudasai-dem-tsu-fbc85980.mp4", tieuDe: "Mua đồ ở siêu thị: cho tôi ~ và cách đếm tsu", thoiLuongGiay: 464 },
    ],
  },
  "s113-b2-05-nha-hang-goi-mon": {
    "dau-bai": [
      { id: "jp-s113-b2-05", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/04-bai-2/04-05-nha-hang-goi-mon-nan-no-doko-no-f8d19240.mp4", tieuDe: "Nhà hàng: gọi món, hỏi món gì và của nước nào", thoiLuongGiay: 498 },
    ],
  },
  "s113-b2-06-cua-ai-tieng-gi-tong-hop": {
    "dau-bai": [
      { id: "jp-s113-b2-06", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/04-bai-2/04-06-cua-ai-tieng-gi-tong-hop-bai-2-d458598d.mp4", tieuDe: "Của ai, tiếng gì và tổng hợp Bài 2 cùng khuôn đề thi nói", thoiLuongGiay: 549 },
    ],
  },
  "s113-b3-01-doc-gio-hoi-gio-mo-cua": {
    "dau-bai": [
      { id: "jp-s113-b3-01", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-01-doc-gio-phut-hoi-gio-mo-cua-ff768edb.mp4", tieuDe: "Đọc giờ, phút và hỏi giờ mở cửa", thoiLuongGiay: 587 },
    ],
  },
  "s113-b3-02-thu-thang-ngay-lich-nam": {
    "dau-bai": [
      { id: "jp-s113-b3-02", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-02-thu-thang-ngay-lich-nam-642c87c7.mp4", tieuDe: "Thứ, tháng, ngày: đọc ngày đặc biệt và hỏi bao giờ", thoiLuongGiay: 656 },
    ],
  },
  "s113-b3-03-dong-tu-masu-he-wo": {
    "dau-bai": [
      { id: "jp-s113-b3-03", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-03-dong-tu-masu-tro-tu-e-o-ac6e1651.mp4", tieuDe: "Động từ đuôi masu, phủ định masen và hai trợ từ e (đi đâu), o (làm gì)", thoiLuongGiay: 624 },
    ],
  },
  "s113-b3-04-ni-gio-de-noi-ke-mot-ngay": {
    "dau-bai": [
      { id: "jp-s113-b3-04", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-04-tro-tu-ni-de-ke-mot-ngay-e9d43a33.mp4", tieuDe: "Trợ từ ni (mốc giờ) và de (nơi làm việc): kể một ngày của mình", thoiLuongGiay: 543 },
    ],
  },
  "s113-b3-05-ya-nado-nanimo-dokoemo": {
    "dau-bai": [
      { id: "jp-s113-b3-05", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-05-ya-nado-nani-mo-doko-e-mo-3111190d.mp4", tieuDe: "Liệt kê vài thứ với ya, nado và nói không gì cả, không đâu cả", thoiLuongGiay: 626 },
    ],
  },
  "s113-b3-06-chu-han-gio-thu-buoi": {
    "dau-bai": [
      { id: "jp-s113-b3-06", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-06-chu-han-gio-thu-buoi-5756ffaf.mp4", tieuDe: "Chữ Hán Bài 3: giờ, thứ, buổi trong ngày (11 chữ)", thoiLuongGiay: 780 },
    ],
  },
  "s113-b3-07-on-bai-3-thi-noi-lesson-3": {
    "dau-bai": [
      { id: "jp-s113-b3-07", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-07-on-bai-3-luyen-thi-noi-jpd113-58ec7b29.mp4", tieuDe: "Ôn Bài 3 và luyện thi nói JPD113: khuôn đề, cách chấm, 10 dạng câu hỏi", thoiLuongGiay: 534 },
    ],
  },
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
  "b5-hoi-thoai": {
    "dau-bai": [
      { id: "jp-b5-0", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/07-bai-5/07-01-hoi-thoai-cuoi-tuan-da-lam-gi-580d9160.mp4", tieuDe: "Hội thoại Bài 5: cuối tuần đã làm gì, thấy thế nào, kỳ nghỉ tới", thoiLuongGiay: 741 },
    ],
  },
  "b5-tu-vung": {
    "dau-bai": [
      { id: "jp-b5-tv1", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/07-bai-5/07-02-tu-vung-thoi-gian-noi-chon-viec-lam-9b9b05a2.mp4", tieuDe: "Từ vựng Bài 5 (1): thời gian, nơi chốn, người đi cùng, việc làm", thoiLuongGiay: 702 },
    ],
    "#4. Đồ vật": [
      { id: "jp-b5-tv2", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/07-bai-5/07-03-tu-vung-do-vat-cam-tuong-thich-muon-3fc0b338.mp4", tieuDe: "Từ vựng Bài 5 (2): đồ vật, tính từ cảm tưởng, thích – muốn – tại sao", thoiLuongGiay: 544 },
    ],
  },
  "b5-ngu-phap": {
    "#Bảng tổng": [
      { id: "jp-b5-chia", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/07-bai-5/07-04-bang-chia-qua-khu-4-loai-tu-31e2ffc5.mp4", tieuDe: "Bảng chia quá khứ: động từ, tính từ đuôi i, đuôi na, danh từ", thoiLuongGiay: 568 },
    ],
    "#ポイント 37": [
      { id: "jp-b5-p1", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/07-bai-5/07-05-diem-37-38-da-lam-gi-the-nao-32f1ef6f.mp4", tieuDe: "Điểm 37–38: đã làm gì, thấy thế nào", thoiLuongGiay: 613 },
    ],
    "#ポイント 39": [
      { id: "jp-b5-p2", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/07-bai-5/07-06-diem-39-43-thich-muon-di-de-lam-2e290692.mp4", tieuDe: "Điểm 39–43: thích, muốn có, muốn làm, đi để làm gì", thoiLuongGiay: 708 },
    ],
    "#ポイント 44": [
      { id: "jp-b5-p3", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/07-bai-5/07-07-diem-44-47-tai-sao-sau-do-voi-ai-c2873e27.mp4", tieuDe: "Điểm 44–47: tại sao, sau đó, với ai, vì… nên + tổng hợp trợ từ", thoiLuongGiay: 674 },
    ],
  },
  "b5-han-lop": {
    "dau-bai": [
      { id: "jp-b5-kj", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/07-bai-5/07-08-chu-han-lop-bai-5-6e08af31.mp4", tieuDe: "Chữ Hán của lớp Bài 5: Tiên, Chu, Mỗi, Ngọ, Hậu, Kiến, Thực, Ẩm, Mãi, Vật, Hành, Hưu", thoiLuongGiay: 762 },
    ],
  },
  "b5-noi": {
    "dau-bai": [
      { id: "jp-b5-noi", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/07-bai-5/07-09-noi-cuoi-tuan-cua-toi-cau-thi-f56a851c.mp4", tieuDe: "Luyện nói: cuối tuần của tôi và câu hỏi thi Bài 5", thoiLuongGiay: 649 },
    ],
  },
  "b6-hoi-thoai": {
    "dau-bai": [
      { id: "jp-b6-0", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/08-bai-6/08-01-hoi-thoai-ru-di-choi-chon-cho-hen-gap-ab077f83.mp4", tieuDe: "Hội thoại Bài 6: rủ đi chơi, chọn chỗ, hẹn gặp", thoiLuongGiay: 747 },
    ],
  },
  "b6-tu-vung": {
    "dau-bai": [
      { id: "jp-b6-tv1", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/08-bai-6/08-02-tu-vung-thoi-gian-giai-tri-do-an-dd6d242b.mp4", tieuDe: "Từ vựng Bài 6 (1): kế hoạch, giải trí, đồ vật, ăn uống", thoiLuongGiay: 683 },
    ],
    "#E. Tính từ & từ so sánh": [
      { id: "jp-b6-tv2", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/08-bai-6/08-03-tu-vung-so-sanh-pho-tu-cau-giao-tiep-f77c105d.mp4", tieuDe: "Từ vựng Bài 6 (2): so sánh, phó từ, câu giao tiếp, 8 câu mẫu", thoiLuongGiay: 639 },
    ],
  },
  "b6-ngu-phap": {
    "#ポイント 48": [
      { id: "jp-b6-p1", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/08-bai-6/08-04-diem-48-49-ru-nhan-loi-tu-choi-d2780bee.mp4", tieuDe: "Điểm 48–49: rủ, nhận lời, từ chối khéo", thoiLuongGiay: 672 },
    ],
    "#ポイント 50": [
      { id: "jp-b6-p2", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/08-bai-6/08-05-diem-50-52-co-hen-su-kien-may-ve-4b1260be.mp4", tieuDe: "Điểm 50–52: có hẹn, có sự kiện ở đâu, có mấy vé", thoiLuongGiay: 768 },
    ],
    "#ポイント 53": [
      { id: "jp-b6-p3", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/08-bai-6/08-06-diem-53-56-nhat-hon-chon-mot-trong-hai-e7dfe0e6.mp4", tieuDe: "Điểm 53–56: nhất, hơn, chọn một trong hai", thoiLuongGiay: 710 },
    ],
    "#ポイント 57": [
      { id: "jp-b6-p4", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/08-bai-6/08-07-diem-57-60-da-chua-goi-y-ne-yo-d023f15d.mp4", tieuDe: "Điểm 57–60: đã… chưa, gợi ý, đuôi câu ne và yo", thoiLuongGiay: 629 },
    ],
  },
  "b6-han-lop": {
    "dau-bai": [
      { id: "jp-b6-kj", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/08-bai-6/08-08-chu-han-lop-bai-6-b3240daf.mp4", tieuDe: "Chữ Hán của lớp Bài 6: Lai, Quy, Hội, Xã, Văn, Độc, Thư, Kim, Thoại", thoiLuongGiay: 705 },
    ],
  },
  "b6-noi": {
    "dau-bai": [
      { id: "jp-b6-noi", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/08-bai-6/08-09-noi-ru-chon-hen-cau-thi-a328508a.mp4", tieuDe: "Luyện nói: rủ, chọn, hẹn và câu hỏi thi Bài 6", thoiLuongGiay: 657 },
    ],
  },
  "b7-hoi-thoai": {
    "dau-bai": [
      { id: "jp-b7-0", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09-bai-7/09-01-hoi-thoai-hoi-duong-chuan-bi-tiec-eb8e8e4c.mp4", tieuDe: "Hội thoại Bài 7: hỏi đường, chuẩn bị tiệc, vui tiệc", thoiLuongGiay: 794 },
    ],
  },
  "b7-tu-vung": {
    "dau-bai": [
      { id: "jp-b7-tv1", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09-bai-7/09-02-tu-vung-vi-tri-duong-pho-bep-3602d8a8.mp4", tieuDe: "Từ vựng Bài 7 (1): vị trí, đường phố, gọi điện, nhà bếp", thoiLuongGiay: 692 },
    ],
    "#E.": [
      { id: "jp-b7-tv2", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09-bai-7/09-03-tu-vung-dong-tu-chuan-bi-tiec-o-bua-tiec-3f7b8663.mp4", tieuDe: "Từ vựng Bài 7 (2): động từ chuẩn bị tiệc, ở bữa tiệc, 5 câu mẫu", thoiLuongGiay: 701 },
    ],
  },
  "b7-ngu-phap": {
    "#Thể て": [
      { id: "jp-b7-chia", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09-bai-7/09-04-the-te-ba-nhom-dong-tu-a82c315b.mp4", tieuDe: "Thể te: ba nhóm động từ và bài hát quy tắc", thoiLuongGiay: 734 },
    ],
    "#ポイント 61": [
      { id: "jp-b7-p1", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09-bai-7/09-05-diem-61-62-o-dau-o-do-co-gi-0d552d0a.mp4", tieuDe: "Điểm 61–62: ai ở đâu, ở đó có gì", thoiLuongGiay: 517 },
    ],
    "#ポイント 63": [
      { id: "jp-b7-p2", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09-bai-7/09-06-diem-63-66-71-nho-cach-lam-bang-gi-8a832cf7.mp4", tieuDe: "Điểm 63, 66, 71: nhờ làm, cách làm, làm bằng gì", thoiLuongGiay: 646 },
    ],
    "#ポイント 64": [
      { id: "jp-b7-p3", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09-bai-7/09-07-diem-64-65-dang-lam-de-toi-giup-1561edac.mp4", tieuDe: "Điểm 64–65: đang làm gì, để tôi giúp nhé", thoiLuongGiay: 526 },
    ],
    "#ポイント 67": [
      { id: "jp-b7-p4", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09-bai-7/09-08-diem-67-70-con-het-ai-cai-nao-c63937e9.mp4", tieuDe: "Điểm 67–70: còn hay hết, ai làm, cái nào", thoiLuongGiay: 597 },
    ],
  },
  "chia-dong-tu": {
    "dau-bai": [
      { id: "jp-b7-chia", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09-bai-7/09-04-the-te-ba-nhom-dong-tu-a82c315b.mp4", tieuDe: "Thể te: ba nhóm động từ và bài hát quy tắc", thoiLuongGiay: 734 },
    ],
  },
  "b7-han-lop": {
    "dau-bai": [
      { id: "jp-b7-kj", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09-bai-7/09-09-chu-han-lop-bai-7-2eccd47f.mp4", tieuDe: "Chữ Hán của lớp Bài 7: Ngôn, Bối, Điền, Lực, Môn, Tự, Nhục, Liệu, Lý, Dã, Bán, Đại, Tiểu", thoiLuongGiay: 795 },
    ],
  },
  "b7-noi": {
    "dau-bai": [
      { id: "jp-b7-noi", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09-bai-7/09-10-noi-vi-tri-dang-lam-nho-va-cau-thi-90417811.mp4", tieuDe: "Luyện nói: vị trí, đang làm gì, nhờ vả và câu hỏi thi Bài 7", thoiLuongGiay: 644 },
    ],
  },
  "slot-01-l4-1-vi-tri-thoi-gian-di-duong": {
    "dau-bai": [
      { id: "jp-s45-s01", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09a-slide-lop-b4-5/01-slot-01-que-o-dau-di-mat-bao-lau-f3206666.mp4", tieuDe: "Slot 1: quê bạn ở đâu, đi mất bao lâu", thoiLuongGiay: 753 },
    ],
  },
  "slot-02-l4-2-tinh-tu-kanji-4": {
    "dau-bai": [
      { id: "jp-s45-s02", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09a-slide-lop-b4-5/02-slot-02-tinh-tu-i-na-va-9-chu-han-04179880.mp4", tieuDe: "Slot 2: tính từ đuôi i, đuôi na và 9 chữ Hán Bài 4", thoiLuongGiay: 856 },
    ],
  },
  "slot-03-l4-2-tiep-l4-3-aru-soshite-ga-thoi-tiet": {
    "dau-bai": [
      { id: "jp-s45-s03", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09a-slide-lop-b4-5/03-slot-03-co-gi-o-do-va-thoi-tiet-eb12001c.mp4", tieuDe: "Slot 3: ở đó có gì, và, nhưng, thời tiết", thoiLuongGiay: 768 },
    ],
  },
  "slot-04-l4-3-tiep-on-tap-b4": {
    "dau-bai": [
      { id: "jp-s45-s04", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09a-slide-lop-b4-5/04-slot-04-tong-on-bai-4-thoi-tiet-do-an-0dc4112f.mp4", tieuDe: "Slot 4: tổng ôn Bài 4 — thời tiết, vị giác, món ăn", thoiLuongGiay: 583 },
    ],
  },
  "slot-09-kanji-5-on-tap-l5-chua-b5": {
    "dau-bai": [
      { id: "jp-s45-s09", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09a-slide-lop-b4-5/05-slot-09-on-chu-han-5-va-tong-on-bai-5-6f5bf0ed.mp4", tieuDe: "Slot 9: ôn chữ Hán Bài 5 và tổng ôn ngữ pháp Bài 5", thoiLuongGiay: 460 },
    ],
  },
  "bt-b45-tu-vung-ngu-phap-dap-an": {
    "#A. BT từ vựng Bài 4": [
      { id: "jp-s45-bt1", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09a-slide-lop-b4-5/06-chua-bt-tu-vung-ngu-phap-bai-4-d099b938.mp4", tieuDe: "Chữa bài tập của cô: từ vựng và ngữ pháp Bài 4", thoiLuongGiay: 664 },
    ],
    "#C. BT từ vựng Bài 5": [
      { id: "jp-s45-bt2", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09a-slide-lop-b4-5/07-chua-bt-tu-vung-ngu-phap-bai-5-69344994.mp4", tieuDe: "Chữa bài tập của cô: từ vựng và ngữ pháp Bài 5", thoiLuongGiay: 664 },
    ],
  },
  "on-giua-ky-b4-5-dap-an": {
    "#PHẦN TRẮC NGHIỆM — I. Chữ Hán": [
      { id: "jp-s45-gk1", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09a-slide-lop-b4-5/08-on-giua-ky-trac-nghiem-chu-han-ngu-phap-b2965546.mp4", tieuDe: "Ôn giữa kỳ B4–5: phần trắc nghiệm chữ Hán và ngữ pháp", thoiLuongGiay: 714 },
    ],
    "#PHẦN VIẾT — I. Điền trợ từ": [
      { id: "jp-s45-gk2", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09a-slide-lop-b4-5/09-on-giua-ky-phan-viet-va-kanji-mid-e8bd7776.mp4", tieuDe: "Ôn giữa kỳ B4–5: phần viết và đọc Kanji Mid", thoiLuongGiay: 577 },
    ],
  },
  "slot-10-on-kanji5-l6-1": {
    "dau-bai": [
      { id: "jp-s67-s10", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/01-slot-10-on-han-tu-5-roi-ban-di-choi-23779dd5.mp4", tieuDe: "Slot 10: chữ Hán Bài 5 và rủ bạn đi chơi", thoiLuongGiay: 646 },
    ],
  },
  "slot-11-test1-l6-1-tiep": {
    "dau-bai": [
      { id: "jp-s67-s11", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/02-slot-11-su-kien-de-ga-arimasu-va-dem-ve-ac16fc3c.mp4", tieuDe: "Slot 11: sự kiện, phân biệt ni và de, đếm vé", thoiLuongGiay: 456 },
    ],
  },
  "slot-12-l6-2-docchi": {
    "dau-bai": [
      { id: "jp-s67-s12", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/03-slot-12-so-sanh-nhat-hon-hoi-chon-a41102a2.mp4", tieuDe: "Slot 12: so sánh nhất, hơn, chọn một trong hai", thoiLuongGiay: 425 },
    ],
  },
  "slot-13-l6-3-yakusoku": {
    "dau-bai": [
      { id: "jp-s67-s13", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/04-slot-13-hen-ngay-gio-mou-mada-yo-ne-b327cc96.mp4", tieuDe: "Slot 13: hẹn ngày giờ với mou, mada, yo, ne", thoiLuongGiay: 469 },
    ],
  },
  "slot-15-on-kanji6-l7-1": {
    "dau-bai": [
      { id: "jp-s67-s15", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/05-slot-15-vi-tri-arimasu-imasu-va-hoi-duong-ea701aa2.mp4", tieuDe: "Slot 15: vị trí, arimasu và imasu, hỏi đường", thoiLuongGiay: 494 },
    ],
  },
  "slot-16-l7-2-chuan-bi-tiec": {
    "dau-bai": [
      { id: "jp-s67-s16", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/06-slot-16-nhom-dong-tu-the-te-kudasai-de-0deb5bb2.mp4", tieuDe: "Slot 16: nhóm động từ, thể te, te kudasai và trợ từ de", thoiLuongGiay: 498 },
    ],
  },
  "slot-17-l7-2-tiep-kanji7": {
    "dau-bai": [
      { id: "jp-s67-s17", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/07-slot-17-cach-lam-dono-dore-chu-han-bai-7-fb80210d.mp4", tieuDe: "Slot 17: cách làm, dono và dore, chữ Hán Bài 7", thoiLuongGiay: 455 },
    ],
  },
  "slot-18-l7-3-tiec": {
    "dau-bai": [
      { id: "jp-s67-s18", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/08-slot-18-dang-lam-gi-de-toi-giup-ai-lam-con-het-561177ae.mp4", tieuDe: "Slot 18: đang làm gì, để tôi giúp, ai làm, còn hay hết", thoiLuongGiay: 422 },
    ],
  },
  "slide-tong-hop-b6": {
    "dau-bai": [
      { id: "jp-s67-on6", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/09-on-thi-bai-6-13-diem-chu-han-trac-nghiem-1aead5e3.mp4", tieuDe: "Ôn kiểm tra Bài 6: 13 điểm, chữ Hán, trắc nghiệm", thoiLuongGiay: 447 },
    ],
  },
  "slot-14-kanji6-on-l6-chua-b6": {
    "#Phần 2": [
      { id: "jp-s67-on6", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/09-on-thi-bai-6-13-diem-chu-han-trac-nghiem-1aead5e3.mp4", tieuDe: "Ôn kiểm tra Bài 6: 13 điểm, chữ Hán, trắc nghiệm", thoiLuongGiay: 447 },
    ],
  },
  "slide-tong-hop-b7": {
    "dau-bai": [
      { id: "jp-s67-on7", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/10-on-thi-bai-7-the-te-11-diem-chu-han-b4df6b40.mp4", tieuDe: "Ôn kiểm tra Bài 7: thể te, 11 điểm, chữ Hán", thoiLuongGiay: 503 },
    ],
  },
  "chia-the-te-bt-bai-7": {
    "dau-bai": [
      { id: "jp-s67-on7", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/10-on-thi-bai-7-the-te-11-diem-chu-han-b4df6b40.mp4", tieuDe: "Ôn kiểm tra Bài 7: thể te, 11 điểm, chữ Hán", thoiLuongGiay: 503 },
      { id: "jp-s67-bttete", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/13-chua-bai-tap-chia-the-te-49-dong-tu-a3eebb18.mp4", tieuDe: "Chữa bài chia thể te: cách làm 49 động từ", thoiLuongGiay: 273 },
    ],
  },
  "slot-19-on-kanji7-on-l7-chua-bt7": {
    "#Phần 2": [
      { id: "jp-s67-on7", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/10-on-thi-bai-7-the-te-11-diem-chu-han-b4df6b40.mp4", tieuDe: "Ôn kiểm tra Bài 7: thể te, 11 điểm, chữ Hán", thoiLuongGiay: 503 },
    ],
  },
  "bt-tu-vung-ngu-phap-b6-7": {
    "#A. BT Từ vựng Bài 6": [
      { id: "jp-s67-bt6", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/11-chua-bai-tap-bai-6-tu-vung-va-ngu-phap-6aecf8a2.mp4", tieuDe: "Chữa bài tập Bài 6: cách làm từng dạng và đáp án", thoiLuongGiay: 378 },
    ],
    "#B. BT Ngữ pháp Bài 6": [
      { id: "jp-s67-bt6", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/11-chua-bai-tap-bai-6-tu-vung-va-ngu-phap-6aecf8a2.mp4", tieuDe: "Chữa bài tập Bài 6: cách làm từng dạng và đáp án", thoiLuongGiay: 378 },
    ],
    "#C. BT Từ vựng Bài 7": [
      { id: "jp-s67-bt7", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/12-chua-bai-tap-bai-7-tu-vung-va-ngu-phap-0c1d918b.mp4", tieuDe: "Chữa bài tập Bài 7: cách làm từng dạng và đáp án", thoiLuongGiay: 329 },
    ],
    "#D. BT Ngữ pháp Bài 7": [
      { id: "jp-s67-bt7", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/09b-slide-lop-b6-7/12-chua-bai-tap-bai-7-tu-vung-va-ngu-phap-0c1d918b.mp4", tieuDe: "Chữa bài tập Bài 7: cách làm từng dạng và đáp án", thoiLuongGiay: 329 },
    ],
  },
  "cuoi-ky-cau-truc": {
    "dau-bai": [
      { id: "jp-ck-01", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/11-on-cuoi-ky-jpd123/11-01-de-cuoi-ky-co-gi-diem-va-chien-luoc-6685bd86.mp4", tieuDe: "Đề cuối kỳ có gì? Bản đồ bài thi viết, thi nói và chiến lược từng phần", thoiLuongGiay: 567 },
    ],
  },
  "cuoi-ky-ngu-phap": {
    "#E.": [
      { id: "jp-ck-02", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/11-on-cuoi-ky-jpd123/11-02-tro-tu-nhin-dong-tu-chon-nhan-67d41466.mp4", tieuDe: "Trợ từ: nhìn động từ cuối câu để chọn nhãn dán đúng", thoiLuongGiay: 459 },
    ],
    "#F.": [
      { id: "jp-ck-03", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/11-on-cuoi-ky-jpd123/11-03-tu-de-hoi-nhin-cau-tra-loi-209e61bc.mp4", tieuDe: "Từ để hỏi: nhìn câu trả lời để đoán câu hỏi", thoiLuongGiay: 415 },
    ],
    "#A2.": [
      { id: "jp-ck-10", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/11-on-cuoi-ky-jpd123/11-10-bang-chia-tinh-tu-va-qua-khu-0f7bd171.mp4", tieuDe: "Bảng chia tính từ và quá khứ: mô phỏng máy chia bốn dạng", thoiLuongGiay: 386 },
    ],
  },
  "cuoi-ky-chia-dong-tu": {
    "dau-bai": [
      { id: "jp-ck-04", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/11-on-cuoi-ky-jpd123/11-04-chia-dong-tu-ba-buoc-4f2ebbc2.mp4", tieuDe: "Chia động từ: ba bước — nhận nhóm, đổi đuôi, kiểm bằng bài hát", thoiLuongGiay: 405 },
    ],
  },
  "cuoi-ky-chu-han": {
    "dau-bai": [
      { id: "jp-ck-05", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/11-on-cuoi-ky-jpd123/11-05-chu-han-bai-4-7-va-chu-nhieu-54753290.mp4", tieuDe: "Chữ Hán Bài 4–7: học theo từ và phân biệt chữ na ná", thoiLuongGiay: 464 },
    ],
  },
  "cuoi-ky-noi": {
    "#4. Câu hỏi KHÔNG tranh": [
      { id: "jp-ck-06", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/11-on-cuoi-ky-jpd123/11-06-thi-noi-hoi-dap-khong-tranh-ef64bdd9.mp4", tieuDe: "Thi nói: hỏi đáp không tranh — khung trả lời cho Bài 4 đến Bài 7", thoiLuongGiay: 459 },
    ],
    "#5. Câu hỏi CÓ tranh": [
      { id: "jp-ck-07", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/11-on-cuoi-ky-jpd123/11-07-thi-noi-cau-hoi-co-tranh-ad12eabc.mp4", tieuDe: "Thi nói: câu hỏi có tranh — sáu bức tranh luyện", thoiLuongGiay: 395 },
    ],
    "#6. Reading": [
      { id: "jp-ck-08", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/11-on-cuoi-ky-jpd123/11-08-thi-noi-doc-to-45-diem-ce171b5b.mp4", tieuDe: "Thi nói: đọc to 45 điểm — 20 giây chuẩn bị và ba quy tắc đọc", thoiLuongGiay: 354 },
    ],
  },
  "cuoi-ky-de-luyen": {
    "dau-bai": [
      { id: "jp-ck-09", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/11-on-cuoi-ky-jpd123/11-09-chua-de-luyen-chon-chia-doc-hieu-dich-84484a5b.mp4", tieuDe: "Chữa đề luyện cuối kỳ: chọn đáp án, chia từ, đọc hiểu, dịch", thoiLuongGiay: 425 },
    ],
  },
  "cuoi-ky-nghe": {
    "dau-bai": [
      { id: "jp-ck-11", src: "https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/11-on-cuoi-ky-jpd123/11-11-luyen-nghe-4-bay-kinh-dien-4a6d3a35.mp4", tieuDe: "Luyện nghe: cách nghe, số giờ hay nghe sai và bốn bẫy kinh điển", thoiLuongGiay: 348 },
    ],
  },
};
