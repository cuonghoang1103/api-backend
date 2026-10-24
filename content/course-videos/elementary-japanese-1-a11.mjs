/**
 * Video bài giảng tiếng Việt (giọng chủ kênh + giọng Nhật Azure) cho JPD113 — Elementary Japanese 1-A1.1 (≈ Dekiru Bài 0–3).
 * ─────────────────────────────────────────────────────────────────────────────
 * Khung CHỜ VIDEO (15/10/2026): mỗi bài VIDEO của khoá một dòng `{ }` (seed bỏ qua dòng
 * rỗng), chú thích cuối dòng = video dự kiến theo ~/Documents/video-bai-giang/KE-HOACH-JPD.md §1.2.
 * Video tự làm nằm ở thư mục khoá `~/Videos/CuongThai-KhoaHoc/tieng-nhat-dekiru` (KHÁC slug khoá
 * Academy) ⇒ gắn bằng `xuat/gan-sach.mts` (đọc trường `academy` trong thong-tin.json, ghi
 * `vi: { url }, defaultVideoTrack: 'VI'` vào đúng dòng — cùng cách ghi với xuat/gan-web.mts).
 * Một bài Academy chỉ gắn MỘT video ⇒ bài gộp nhiều video dùng bản ghép `-tron` (xuat/ghep-phan.mts).
 *
 * Chưa có `yt` tuyển chọn ⇒ trang học chỉ có nút VI khi video lên. Áp vào CSDL:
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/elementary-japanese-1-a11.mjs          (dry)
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/elementary-japanese-1-a11.mjs --apply  (deploy-nha chạy --all)
 */
export default {
  courseSlug: 'elementary-japanese-1-a11',
  lessons: {
    'jpd113-gioi-thieu': { }, // dự kiến: jp-0-1
    'jpd113-dieu-kien-qua-mon': { }, // dự kiến: jp-0-1
    'jpd113-hiragana-goc': { }, // dự kiến: ghép jp-h-1…h-4 (-tron)
    'jpd113-hiragana-bien-am': { }, // dự kiến: jp-h-5
    'jpd113-n-truong-am-tro-tu': { }, // dự kiến: jp-h-6
    'jpd113-katakana': { }, // dự kiến: ghép jp-k-1…k-4 (-tron)
    'jpd113-chao-hoi-so': { }, // dự kiến: jp-0-2
    'jpd113-so-dem-day-du': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/04-bai-2/04-03-so-dem-va-gia-tien-e30b88f5.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b2-p2
    'jpd113-tien-gia-ca': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/04-bai-2/04-03-so-dem-va-gia-tien-e30b88f5.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b2-p2
    'jpd113-ngay-gio-tuoi': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-01-doc-gio-phut-hoi-gio-mo-cua-ff768edb.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b3-gio
    'jpd113-youbi': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-02-thu-thang-ngay-lich-nam-642c87c7.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b3-gio
    'jpd113-dem-tang': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/04-bai-2/04-01-hoi-cho-toa-nha-tang-may-1ffaa516.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b2-p1
    'jpd113-nguphap-chuong3': { },
    'jpd113-bai-1-ngu-phap': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/03-bai-1/03-01-chao-lan-dau-noi-ten-hoi-ten-9bb5aac4.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b1-p1 (+ jp-b1-p2)
    'jpd113-mo-ka': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/03-bai-1/03-05-so-thich-to-mo-giong-nhau-1925ebe6.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b1-p2
    'jpd113-quoc-tich-nghe-nghiep': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/03-bai-1/03-02-ten-nuoc-nguoi-nuoc-nao-khong-phai-6d511c3e.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b1-0
    'jpd113-tu-trong-ngon-ngu-khac': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/04-bai-2/04-06-cua-ai-tieng-gi-tong-hop-bai-2-d458598d.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b2-p3
    'jpd113-nguphap-chuong4': { },
    'jpd113-bai-2-3-ngu-phap': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/04-bai-2/04-01-hoi-cho-toa-nha-tang-may-1ffaa516.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b2-p1
    'jpd113-kono-sono-ano': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/04-bai-2/04-02-do-vat-gan-xa-kore-sore-are-14a6f348.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b2-p1
    'jpd113-tu-de-hoi': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/04-bai-2/04-05-nha-hang-goi-mon-nan-no-doko-no-f8d19240.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b2-p3
    'jpd113-tro-tu-wo-ni-de-e': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-04-tro-tu-ni-de-ke-mot-ngay-e9d43a33.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b3-p1
    'jpd113-kochira-dokono-nanno': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/04-bai-2/04-05-nha-hang-goi-mon-nan-no-doko-no-f8d19240.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b2-p1
    'jpd113-to-ya-nado': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-05-ya-nado-nani-mo-doko-e-mo-3111190d.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b3-p2
    'jpd113-nguphap-chuong5': { },
    'jpd113-masu-form': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-03-dong-tu-masu-tro-tu-e-o-ac6e1651.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b3-chia
    'jpd113-dong-tu-thuong-gap': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-03-dong-tu-masu-tro-tu-e-o-ac6e1651.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b3-tv2
    'jpd113-idou-full': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-05-ya-nado-nani-mo-doko-e-mo-3111190d.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b3-p1 · jp-b3-p2
    'jpd113-kara-made': { }, // dự kiến: jp-b3-p2
    'jpd113-nguphap-chuong6': { },
    'jpd113-kanji': { }, // dự kiến: jp-b1-kj
    'jpd113-kanji-so-thoi-gian': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-06-chu-han-gio-thu-buoi-5756ffaf.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b2-kj
    'jpd113-kanji-nguoi-truong-hoc': { }, // dự kiến: jp-b3-kj
    'jpd113-nang-cao': { },
    'jpd113-speaking-cau-truc': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-07-on-bai-3-luyen-thi-noi-jpd113-58ec7b29.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-0-2
    'jpd113-speaking-doc-1-7': { },
    'jpd113-speaking-doc-8-13': { },
    'jpd113-speaking-cau-hoi-khong-tranh': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/05-bai-3/05-07-on-bai-3-luyen-thi-noi-jpd113-58ec7b29.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b1-noi
    'jpd113-speaking-cau-hoi-co-tranh': { },
    'jpd113-speaking-lo-trinh-meo': { },
  },
};
