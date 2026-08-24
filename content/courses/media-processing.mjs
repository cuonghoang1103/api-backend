/**
 * Media Processing — khoá học CuongThai (Courses, academyType=GENERAL).
 * Giáo trình tự soạn: 11 mục, song ngữ EN/VI. Số đo từ chính
 * src/storage/imageOptimizer.ts (249 dòng), src/services/video.service.ts (171),
 * src/services/makerlab/audio.ts (185), src/services/makerlab/tts.ts (1,249)
 * — chứa vá thật cho decompression bomb, quản concurrency Sharp, và cầu
 * ffmpeg/mpg123 cho pipeline âm thanh.
 */

import s00 from './media-processing/s00-intro.mjs';
import s01 from './media-processing/s01-sharp.mjs';
import s02 from './media-processing/s02-sharp-prod.mjs';
import s03 from './media-processing/s03-ffmpeg.mjs';
import s04 from './media-processing/s04-audio.mjs';
import s05 from './media-processing/s05-pipeline.mjs';
import s06 from './media-processing/s06-cost.mjs';
// import s07 from './media-processing/s07-streaming.mjs';
// import s08 from './media-processing/s08-live.mjs';
// import s09 from './media-processing/s09-chan-doan.mjs';
// import s10 from './media-processing/s10-on-thi.mjs';

export default {
  category: { slug: 'devops', name: 'DevOps & Vận hành', icon: 'Server', sortOrder: 4 },
  course: {
    slug: 'media-processing',
    title: 'Media Processing (Sharp + FFmpeg)',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/media-processing.png',
    shortDescription: 'Sharp cho ảnh, FFmpeg cho video/audio. Pipeline production với concurrency guard, decompression-bomb defense, và thumbnail explosion cost. Số đo từ chính kho này.|||Sharp cho ảnh, FFmpeg cho video/audio. Pipeline production với concurrency guard, decompression-bomb defense, và thumbnail explosion cost. Số đo từ chính kho này.',
    description: 'Khoá Media Processing cho backend Node.js. 11 mục về Sharp (metadata, resize, WebP re-encoding, animated GIF), FFmpeg (video thumbnails, transcoding, audio decode), pipeline pattern (upload → optimize → variants → CDN), cost management, streaming (HLS/DASH), và diagnosis. Vá decompression bomb thật (100MP guard) và mpg123 vs ffmpeg tradeoff (1.5MB vs 80MB image) từ imageOptimizer.ts + audio.ts.',
    tags: 'media,image,video,audio,sharp,ffmpeg,webp,transcoding,streaming,cdn',
  },
  sections: [s00, s01, s02, s03, s04, s05, s06],
};
