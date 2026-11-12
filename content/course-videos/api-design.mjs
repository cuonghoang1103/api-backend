/**
 * Video track for the "API & System Design" course (12/11/2026).
 * Bài giảng tiếng Việt do kênh tự làm (vi: …) — gan-web.mts (video-bai-giang/xuat) tự điền theo thong-tin.json.
 * Chưa có track YouTube tuyển chọn: bài chưa có video VI thì chưa hiện khung video.
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/api-design.mjs --apply
 */
export default {
  courseSlug: 'api-design',
  defaultVideoTrack: 'VI',
  lessons: {
    'api-0-8-bat-dau-tai-day': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/00-vi-sao-thiet-ke-api/00-01-bat-dau-api-la-gi-cdaa6f16.mp4' }, defaultVideoTrack: 'VI' },
    'api-0-2-bo-cong-cu': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/00-vi-sao-thiet-ke-api/00-04-cong-cu-curl-httpie-postman-bruno-8c41205e.mp4' }, defaultVideoTrack: 'VI' },
    'api-0-3-du-an-labflow': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/00-vi-sao-thiet-ke-api/00-05-dung-khung-labflow-api-c986a715.mp4' }, defaultVideoTrack: 'VI' },
    'api-1-1-tai-nguyen': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/01-tai-nguyen-phuong-thuc/01-01-mo-hinh-hoa-tai-nguyen-824f080c.mp4' }, defaultVideoTrack: 'VI' },
    'api-1-2-phuong-thuc': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/01-tai-nguyen-phuong-thuc/01-02-phuong-thuc-va-cam-ket-25cf9320.mp4' }, defaultVideoTrack: 'VI' },
    'api-1-3-status': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/01-tai-nguyen-phuong-thuc/01-03-ma-trang-thai-co-y-nghia-d7c8dfd2.mp4' }, defaultVideoTrack: 'VI' },
    'api-1-4-dat-ten': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/01-tai-nguyen-phuong-thuc/01-04-dat-ten-kieu-chu-nhat-quan-37c9a59f.mp4' }, defaultVideoTrack: 'VI' },
    'api-2-1-problem-details': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/02-loi-kiem-du-lieu-phan-hoi/02-01-problem-details-mot-dinh-dang-loi-bb276c28.mp4' }, defaultVideoTrack: 'VI' },
    'api-2-3-envelope': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/02-loi-kiem-du-lieu-phan-hoi/02-03-hinh-dang-phan-hoi-f9572233.mp4' }, defaultVideoTrack: 'VI' },
    'api-2-4-i18n': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/02-loi-kiem-du-lieu-phan-hoi/02-04-loi-cho-ung-dung-song-ngu-1e58f169.mp4' }, defaultVideoTrack: 'VI' },
  },
};
