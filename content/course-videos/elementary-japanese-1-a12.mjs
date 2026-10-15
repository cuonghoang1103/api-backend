/**
 * Video bài giảng tiếng Việt (giọng chủ kênh + giọng Nhật Azure) cho JPD123 — Elementary Japanese 1-A1.2 (≈ Dekiru Bài 4–8).
 * ─────────────────────────────────────────────────────────────────────────────
 * Khung CHỜ VIDEO (15/10/2026): mỗi bài VIDEO của khoá một dòng `{ }` (seed bỏ qua dòng
 * rỗng), chú thích cuối dòng = video dự kiến theo ~/Documents/video-bai-giang/KE-HOACH-JPD.md §1.2.
 * Video tự làm nằm ở thư mục khoá `~/Videos/CuongThai-KhoaHoc/tieng-nhat-dekiru` (KHÁC slug khoá
 * Academy) ⇒ gắn bằng `xuat/gan-sach.mts` (đọc trường `academy` trong thong-tin.json, ghi
 * `vi: { url }, defaultVideoTrack: 'VI'` vào đúng dòng — cùng cách ghi với xuat/gan-web.mts).
 * Một bài Academy chỉ gắn MỘT video ⇒ bài gộp nhiều video dùng bản ghép `-tron` (xuat/ghep-phan.mts).
 *
 * Chưa có `yt` tuyển chọn ⇒ trang học chỉ có nút VI khi video lên. Áp vào CSDL:
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/elementary-japanese-1-a12.mjs          (dry)
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/elementary-japanese-1-a12.mjs --apply  (deploy-nha chạy --all)
 */
export default {
  courseSlug: 'elementary-japanese-1-a12',
  lessons: {
    'jpd123-gioi-thieu': { }, // dự kiến: jp-0-1
    'jpd123-dieu-kien-qua-mon': { }, // dự kiến: jp-0-1
    'jpd123-dong-tu-masu': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/07-bai-5/07-04-bang-chia-qua-khu-4-loai-tu-31e2ffc5.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b3-chia (+ jp-b5-chia)
    'jpd123-tro-tu': { }, // dự kiến: jp-b3-p1
    'jpd123-tinh-tu': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/06-bai-4/06-05-diem-24-27-ta-noi-chon-mua-muc-do-53e16156.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b4-chia
    'jpd123-tinh-tu-chia-4-dang': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/06-bai-4/06-04-bang-chia-tinh-tu-i-na-8d8bd196.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b4-chia
    'jpd123-tinh-tu-bo-nghia-dong-tu': { }, // dự kiến: — (không thuộc ポイント 1–80, không có video)
    'jpd123-tu-chi-muc-do': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/06-bai-4/06-05-diem-24-27-ta-noi-chon-mua-muc-do-53e16156.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b4-p1
    'jpd123-lien-tu': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/06-bai-4/06-07-diem-32-36-the-nao-va-nhung-nhi-e7b06d0c.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b4-p3
    'jpd123-nguphap-chuong3': { },
    'jpd123-moi-ru': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/08-bai-6/08-04-diem-48-49-ru-nhan-loi-tu-choi-d2780bee.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b6-p1
    'jpd123-dem-thoi-gian': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/08-bai-6/08-05-diem-50-52-co-hen-su-kien-may-ve-4b1260be.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b6-p2
    'jpd123-mong-muon': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/07-bai-5/07-06-diem-39-43-thich-muon-di-de-lam-2e290692.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b5-p2
    'jpd123-muc-dich-chuyen-di': { }, // dự kiến: jp-b5-p2
    'jpd123-so-thich': { }, // dự kiến: jp-b5-p2
    'jpd123-qua-khu-ly-do': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/07-bai-5/07-05-diem-37-38-da-lam-gi-the-nao-32f1ef6f.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: jp-b5-p3
    'jpd123-sac-thai-hoi-thoai': { }, // dự kiến: jp-b6-p4
    'jpd123-so-sanh-hon-kem': { }, // dự kiến: jp-b6-p3
    'jpd123-so-sanh-nhat': { }, // dự kiến: jp-b6-p3
    'jpd123-cau-hoi-so-sanh': { }, // dự kiến: jp-b6-p3
    'jpd123-nguphap-chuong6': { },
    'jpd123-the-te': { }, // dự kiến: jp-b7-chia (+ jp-b7-p2)
    'jpd123-bang-chia-the-te': { }, // dự kiến: jp-b7-chia
    'jpd123-teimasu': { }, // dự kiến: jp-b7-p3
    'jpd123-ton-tai-dung-cu-cach-lam': { }, // dự kiến: jp-b7-p1 (+ jp-b7-p2)
    'jpd123-kanji': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-nhat-dekiru/07-bai-5/07-08-chu-han-lop-bai-5-6e08af31.mp4' }, defaultVideoTrack: 'VI' }, // dự kiến: ghép jp-b4…b7-kj (-tron)
    'jpd123-nang-cao': { },
  },
};
