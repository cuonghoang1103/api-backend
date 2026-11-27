/**
 * Video track for the "tieng-anh-ky-thuat-di-lam" course (28/11/2026).
 * Bài giảng tiếng Việt do kênh tự làm (vi: …) — gan-web.mts (video-bai-giang/xuat) tự điền theo thong-tin.json.
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/tieng-anh-ky-thuat-di-lam.mjs --apply
 */
export default {
  courseSlug: 'tieng-anh-ky-thuat-di-lam',
  defaultVideoTrack: 'VI',
  lessons: {
    'tak-1-1-tai-lieu': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-anh-ky-thuat-di-lam/01-doc-tieng-anh-ky-thuat/01-01-tai-lieu-ad6762dd.mp4' }, defaultVideoTrack: 'VI' },
    'tak-1-2-loi-issue': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-anh-ky-thuat-di-lam/01-doc-tieng-anh-ky-thuat/01-02-loi-issue-3fc52d6b.mp4' }, defaultVideoTrack: 'VI' },
    'tak-1-3-spec': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-anh-ky-thuat-di-lam/01-doc-tieng-anh-ky-thuat/01-03-spec-2810190e.mp4' }, defaultVideoTrack: 'VI' },
    'tak-1-4-lab': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/tieng-anh-ky-thuat-di-lam/01-doc-tieng-anh-ky-thuat/01-04-lab-f2ef9bd1.mp4' }, defaultVideoTrack: 'VI' },
  },
};
