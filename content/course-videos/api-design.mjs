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
    'api-0-8-bat-dau-tai-day': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/00-vi-sao-thiet-ke-api/00-01-bat-dau-api-la-gi-cdaa6f16.mp4' }, defaultVideoTrack: 'VI'},
    'api-0-2-bo-cong-cu': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/00-vi-sao-thiet-ke-api/00-04-cong-cu-curl-httpie-postman-bruno-8c41205e.mp4' }, defaultVideoTrack: 'VI'},
    'api-0-3-du-an-labflow': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/00-vi-sao-thiet-ke-api/00-05-dung-khung-labflow-api-c986a715.mp4' }, defaultVideoTrack: 'VI'},
    'api-1-1-tai-nguyen': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/01-tai-nguyen-phuong-thuc/01-01-mo-hinh-hoa-tai-nguyen-824f080c.mp4' }, defaultVideoTrack: 'VI'},
    'api-1-2-phuong-thuc': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/01-tai-nguyen-phuong-thuc/01-02-phuong-thuc-va-cam-ket-25cf9320.mp4' }, defaultVideoTrack: 'VI'},
    'api-1-3-status': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/01-tai-nguyen-phuong-thuc/01-03-ma-trang-thai-co-y-nghia-d7c8dfd2.mp4' }, defaultVideoTrack: 'VI'},
    'api-1-4-dat-ten': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/01-tai-nguyen-phuong-thuc/01-04-dat-ten-kieu-chu-nhat-quan-37c9a59f.mp4' }, defaultVideoTrack: 'VI'},
    'api-2-1-problem-details': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/02-loi-kiem-du-lieu-phan-hoi/02-01-problem-details-mot-dinh-dang-loi-bb276c28.mp4' }, defaultVideoTrack: 'VI'},
    'api-2-3-envelope': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/02-loi-kiem-du-lieu-phan-hoi/02-03-hinh-dang-phan-hoi-f9572233.mp4' }, defaultVideoTrack: 'VI'},
    'api-2-4-i18n': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/02-loi-kiem-du-lieu-phan-hoi/02-04-loi-cho-ung-dung-song-ngu-1e58f169.mp4' }, defaultVideoTrack: 'VI'},
    'api-2-5-lab': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/02-loi-kiem-du-lieu-phan-hoi/02-05-lab-2-bao-hong-phien-ban-2-14f1b19d.mp4' }, defaultVideoTrack: 'VI'},
    'api-3-1-offset': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/03-danh-sach-phan-trang-loc-sap-xep/03-01-phan-trang-offset-c6dc94cf.mp4' }, defaultVideoTrack: 'VI'},
    'api-3-2-cursor': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/03-danh-sach-phan-trang-loc-sap-xep/03-02-phan-trang-con-tro-451e5560.mp4' }, defaultVideoTrack: 'VI'},
    'api-3-4-sap-xep': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/03-danh-sach-phan-trang-loc-sap-xep/03-04-sap-xep-chon-truong-nhung-quan-he-f0b3db9f.mp4' }, defaultVideoTrack: 'VI'},
    'api-4-1-thay-doi': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/04-versioning-tien-hoa-api/04-01-thay-doi-pha-vo-va-khong-pha-vo-0798c71a.mp4' }, defaultVideoTrack: 'VI'},
    'api-4-2-chien-luoc': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/04-versioning-tien-hoa-api/04-02-chien-luoc-danh-phien-ban-22be1a97.mp4' }, defaultVideoTrack: 'VI'},
    'api-4-3-deprecation': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/04-versioning-tien-hoa-api/04-03-khai-tu-co-bao-truoc-6e01a052.mp4' }, defaultVideoTrack: 'VI'},
    'api-4-5-lab': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/04-versioning-tien-hoa-api/04-05-lab-4-thiet-bi-phien-ban-2-16f134da.mp4' }, defaultVideoTrack: 'VI'},
    'api-0-9-bat-dau-khi-khong-co': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/00-vi-sao-thiet-ke-api/00-02-bat-dau-khi-api-hong-df05e843.mp4' }, defaultVideoTrack: 'VI' },
    'api-0-1-http': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/00-vi-sao-thiet-ke-api/00-03-http-ban-that-su-can-b180b083.mp4' }, defaultVideoTrack: 'VI' },
    'api-1-5-lab': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/01-tai-nguyen-phuong-thuc/01-05-lab-1-bao-hong-thiet-bi-fd603344.mp4' }, defaultVideoTrack: 'VI' },
    'api-2-2-validation': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/02-loi-kiem-du-lieu-phan-hoi/02-02-kiem-du-lieu-vao-ngay-cua-f77bc50c.mp4' }, defaultVideoTrack: 'VI' },
    'api-3-3-loc': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/03-danh-sach-phan-trang-loc-sap-xep/03-03-tham-so-loc-va-tim-kiem-7752ec22.mp4' }, defaultVideoTrack: 'VI' },
    'api-3-5-lab': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/03-danh-sach-phan-trang-loc-sap-xep/03-05-lab-3-danh-sach-bao-tri-15ed2bcb.mp4' }, defaultVideoTrack: 'VI' },
    'api-4-4-app-di-dong': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/04-versioning-tien-hoa-api/04-04-client-khong-chiu-cap-nhat-a84b4ea0.mp4' }, defaultVideoTrack: 'VI' },
    'api-5-1-idempotency': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/05-tin-cay-idempotency-thu-lai/05-01-idempotency-key-cho-post-06e44112.mp4' }, defaultVideoTrack: 'VI' },
    'api-5-2-retry': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/05-tin-cay-idempotency-thu-lai/05-02-thu-lai-lui-dan-timeout-9dc1f56a.mp4' }, defaultVideoTrack: 'VI' },
    'api-5-3-rate-limit': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/05-tin-cay-idempotency-thu-lai/05-03-gioi-han-tan-suat-va-han-muc-5ac06a38.mp4' }, defaultVideoTrack: 'VI' },
    'api-5-4-dong-thoi': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/05-tin-cay-idempotency-thu-lai/05-04-dong-thoi-khoa-lac-quan-etag-960d09ad.mp4' }, defaultVideoTrack: 'VI' },
    'api-5-5-lab': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/05-tin-cay-idempotency-thu-lai/05-05-lab-5-bao-hong-tang-ham-b31544c3.mp4' }, defaultVideoTrack: 'VI' },
    'api-6-2-phan-quyen': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/06-bao-mat-api/06-02-phan-quyen-bola-b94de1e8.mp4' }, defaultVideoTrack: 'VI' },
    'api-6-5-lab': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/api-design/06-bao-mat-api/06-05-lab-6-soat-bao-mat-d211a167.mp4' }, defaultVideoTrack: 'VI' },
  },
};
