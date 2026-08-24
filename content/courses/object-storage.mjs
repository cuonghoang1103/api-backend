/**
 * Object Storage — khoá học CuongThai (Courses, academyType=GENERAL).
 * Giáo trình tự soạn: 11 mục, song ngữ EN/VI. Số đo từ chính src/config/r2.ts của kho
 * (331 dòng) + src/services/upload.service.ts (291 dòng) — đo trên Cloudflare R2 thật.
 */

import s00 from './object-storage/s00-intro.mjs';
import s01 from './object-storage/s01-s3-api.mjs';
import s02 from './object-storage/s02-r2.mjs';
import s03 from './object-storage/s03-urls.mjs';
import s04 from './object-storage/s04-presign.mjs';
import s05 from './object-storage/s05-cors.mjs';
import s06 from './object-storage/s06-lifecycle.mjs';
import s07 from './object-storage/s07-cost.mjs';
import s08 from './object-storage/s08-migration.mjs';
import s09 from './object-storage/s09-chan-doan.mjs';
import s10 from './object-storage/s10-on-thi.mjs';

export default {
  category: { slug: 'devops', name: 'DevOps & Vận hành', icon: 'Server', sortOrder: 4 },
  course: {
    slug: 'object-storage',
    title: 'Object Storage (Cloudflare R2)',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/object-storage.png',
    shortDescription: 'S3 API + Cloudflare R2 (zero egress cost). Presigned URLs, CORS, cache control, cost math, and the SigV4 signature bug this repo caught in production (fixed).|||S3 API + Cloudflare R2 (không có phí egress). Presigned URLs, CORS, cache control, tính cost, và cái bug SigV4 signature mà kho này bắt được ở production (đã vá).',
    description: 'Khoá Object Storage cho backend Node.js dùng Cloudflare R2 và AWS SDK v3. 11 mục đi từ concept (bucket, key, object) tới S3 API, R2 specifics, presigned URL security, CORS, lifecycle, cost math, migration. Mọi số đo lấy từ src/config/r2.ts (331 dòng) + upload.service.ts (291 dòng) của kho này — kèm một security bug thật (SigV4 signableHeaders XSS) mà kho đã bắt và vá.',
    whatYouLearn: 'Hiểu object storage khác file system ở chỗ nào; đọc và sinh presigned URL đúng cách (kể cả bug SigV4 signableHeaders); cấu hình CORS cho browser upload; quản lý cost (R2 zero egress vs S3 $0.09/GB); tune Cache-Control per content type; migrate từ S3 sang R2 mà không mất tin nhắn.',
    requirements: 'Biết TypeScript/JavaScript, đã dùng REST API. Biết HTTP methods + headers. Ưu tiên đã dùng AWS SDK hoặc S3-compatible client trước, nhưng không bắt buộc — Mục 0 dựng từ đầu.',
    documentsNote: 'Tài liệu tham chiếu chính: developers.cloudflare.com/r2 (R2 docs) • docs.aws.amazon.com/AmazonS3/latest/API (S3 API reference) • docs.aws.amazon.com/general/latest/gr/sigv4_signing.html (SigV4 protocol chi tiết).',
  },
  sections: [s00, s01, s02, s03, s04, s05, s06, s07, s08, s09, s10],
};
