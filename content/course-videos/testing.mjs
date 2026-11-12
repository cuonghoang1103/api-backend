/**
 * Video track for the "Testing" course (12/11/2026).
 * Bài giảng tiếng Việt do kênh tự làm (vi: …) — gan-web.mts (video-bai-giang/xuat) tự điền theo thong-tin.json.
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/testing.mjs --apply
 */
export default {
  courseSlug: 'testing',
  defaultVideoTrack: 'VI',
  lessons: {
    'tst-0-8-bat-dau-tai-day': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/00-vi-sao-phai-test/00-01-bat-dau-kiem-thu-la-gi-d954d05d.mp4' }, defaultVideoTrack: 'VI' },
    'tst-0-9-bat-dau-khi-khong-co': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/00-vi-sao-phai-test/00-02-bat-dau-khi-khong-co-test-d10d5534.mp4' }, defaultVideoTrack: 'VI' },
    'tst-0-3-gioi-thieu-du-an': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/00-vi-sao-phai-test/00-03-ve-khoa-hoc-labflow-lite-f408cd28.mp4' }, defaultVideoTrack: 'VI' },
    'tst-0-1-kim-tu-thap': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/00-vi-sao-phai-test/00-04-kim-tu-thap-test-38c435a2.mp4' }, defaultVideoTrack: 'VI' },
    'tst-0-2-cai-dat': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/00-vi-sao-phai-test/00-05-cai-dat-vitest-labflow-lite-1bf1fdc2.mp4' }, defaultVideoTrack: 'VI' },
    'tst-1-1-cau-truc': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/01-unit-test-dau-tien/01-01-giai-phau-mot-test-165ba1fb.mp4' }, defaultVideoTrack: 'VI' },
    'tst-1-2-matcher': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/01-unit-test-dau-tien/01-02-matcher-noi-dung-dieu-ban-muon-22e52f9a.mp4' }, defaultVideoTrack: 'VI' },
    'tst-1-3-ten-test': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/01-unit-test-dau-tien/01-03-dat-ten-va-sap-xep-test-928567d9.mp4' }, defaultVideoTrack: 'VI' },
    'tst-1-4-ham-thuan': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/01-unit-test-dau-tien/01-04-test-ham-thuan-70aeb69d.mp4' }, defaultVideoTrack: 'VI' },
    'tst-1-5-lab-quy-tac': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/01-unit-test-dau-tien/01-05-lab-1-quy-tac-40f86eb0.mp4' }, defaultVideoTrack: 'VI' },
    'tst-2-1-async': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/02-bat-dong-bo-thoi-gian-loi/02-01-test-ma-bat-dong-bo-7d6ea6d3.mp4' }, defaultVideoTrack: 'VI' },
    'tst-2-2-thoi-gian': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/02-bat-dong-bo-thoi-gian-loi/02-02-kiem-soat-thoi-gian-6dec79d9.mp4' }, defaultVideoTrack: 'VI' },
    'tst-2-3-loi': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/02-bat-dong-bo-thoi-gian-loi/02-03-test-loi-nhanh-that-bai-e8646900.mp4' }, defaultVideoTrack: 'VI' },
    'tst-2-4-ngau-nhien': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/02-bat-dong-bo-thoi-gian-loi/02-04-ngau-nhien-bat-dinh-b1722761.mp4' }, defaultVideoTrack: 'VI' },
    'tst-2-5-lab-bat-dong-bo': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/02-bat-dong-bo-thoi-gian-loi/02-05-lab-2-bat-dong-bo-a2817904.mp4' }, defaultVideoTrack: 'VI' },
    'tst-3-1-phan-loai': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/03-mock-stub-spy/03-01-stub-mock-spy-fake-2745a39e.mp4' }, defaultVideoTrack: 'VI' },
    'tst-3-2-mock-module': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/03-mock-stub-spy/03-02-mock-module-va-http-4cdc8b1a.mp4' }, defaultVideoTrack: 'VI' },
    'tst-3-3-qua-da': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/03-mock-stub-spy/03-03-mock-qua-da-1806dc42.mp4' }, defaultVideoTrack: 'VI' },
    'tst-3-4-thiet-ke': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/03-mock-stub-spy/03-04-thiet-ke-de-test-4395b46c.mp4' }, defaultVideoTrack: 'VI' },
    'tst-3-5-lab-test-double': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/03-mock-stub-spy/03-05-lab-3-do-dong-the-6a644681.mp4' }, defaultVideoTrack: 'VI' },
    'tst-4-1-vi-sao': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/04-tich-hop-csdl-that/04-01-vi-sao-csdl-that-33701b58.mp4' }, defaultVideoTrack: 'VI' },
    'tst-4-2-docker-db': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/04-tich-hop-csdl-that/04-02-postgres-dung-mot-lan-55874352.mp4' }, defaultVideoTrack: 'VI' },
    'tst-4-3-testcontainers': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/04-tich-hop-csdl-that/04-03-testcontainers-0029e949.mp4' }, defaultVideoTrack: 'VI' },
    'tst-4-4-co-lap': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/04-tich-hop-csdl-that/04-04-co-lap-7afcee59.mp4' }, defaultVideoTrack: 'VI' },
    'tst-4-5-lab-tich-hop': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/04-tich-hop-csdl-that/04-05-lab-4-adapter-postgres-d891258a.mp4' }, defaultVideoTrack: 'VI' },
    'tst-5-1-supertest': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/05-test-api-http/05-01-supertest-b771a92e.mp4' }, defaultVideoTrack: 'VI' },
    'tst-5-2-xac-thuc': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/05-test-api-http/05-02-xac-thuc-phan-quyen-1b46950f.mp4' }, defaultVideoTrack: 'VI' },
    'tst-5-3-validation': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/05-test-api-http/05-03-validation-8825e510.mp4' }, defaultVideoTrack: 'VI' },
    'tst-5-4-hop-dong': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/testing/05-test-api-http/05-04-hop-dong-openapi-57f68a88.mp4' }, defaultVideoTrack: 'VI' },
  },
};
