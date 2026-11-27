/**
 * Video track for the "log-tu-a-den-z" course (28/11/2026).
 * Bài giảng tiếng Việt do kênh tự làm (vi: …) — gan-web.mts (video-bai-giang/xuat) tự điền theo thong-tin.json.
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/log-tu-a-den-z.mjs --apply
 */
export default {
  courseSlug: 'log-tu-a-den-z',
  defaultVideoTrack: 'VI',
  lessons: {
    'log-10-1-ma-trang-thai': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/log-tu-a-den-z/10-web-server-ung-dung/10-01-ma-trang-thai-7a4d11bf.mp4' }, defaultVideoTrack: 'VI' },
    'log-10-3-apache-iis': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/log-tu-a-den-z/10-web-server-ung-dung/10-03-apache-iis-5c26e01b.mp4' }, defaultVideoTrack: 'VI' },
    'log-10-4-log-node': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/log-tu-a-den-z/10-web-server-ung-dung/10-04-log-node-d1faba26.mp4' }, defaultVideoTrack: 'VI' },
    'log-10-5-log-spring': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/log-tu-a-den-z/10-web-server-ung-dung/10-05-log-spring-7e4af53a.mp4' }, defaultVideoTrack: 'VI' },
    'log-10-6-java-slf4j-cau-hinh': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/log-tu-a-den-z/10-web-server-ung-dung/10-06-java-slf4j-cau-hinh-395dfeff.mp4' }, defaultVideoTrack: 'VI' },
    'log-10-7-java-mdc-json-hieu-nang': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/log-tu-a-den-z/10-web-server-ung-dung/10-07-java-mdc-json-hieu-nang-feec793f.mp4' }, defaultVideoTrack: 'VI' },
    'log-10-8-log-cau-truc': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/log-tu-a-den-z/10-web-server-ung-dung/10-08-log-cau-truc-bc00a29d.mp4' }, defaultVideoTrack: 'VI' },
    'log-10-9-tan-cong-web': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/log-tu-a-den-z/10-web-server-ung-dung/10-09-tan-cong-web-e5dd74ff.mp4' }, defaultVideoTrack: 'VI' },
    'log-10-10-lab': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/log-tu-a-den-z/10-web-server-ung-dung/10-10-lab-4e7d6272.mp4' }, defaultVideoTrack: 'VI' },
  },
};
