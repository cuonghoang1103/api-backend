/**
 * Observability & Monitoring — khoá học CuongThai (Courses, academyType=GENERAL).
 * Giáo trình tự soạn: 13 mục, song ngữ EN/VI.
 *
 * Mọi khối <div class="out"> là ĐO THẬT trong sandbox (Node 22.22.2) hoặc đếm
 * thật trên chính kho này — không có khối nào chép từ tài liệu. Vật liệu gốc:
 * src/utils/logger.ts (40 dòng), src/middleware/errorHandler.ts (135),
 * src/services/sentry.service.ts (250), bốn endpoint /health trong src/index.ts,
 * LOG_PIPELINE.md (351) và SENTRY_SETUP.md (185).
 */

import s00 from './observability-monitoring/s00-intro.mjs';
import s01 from './observability-monitoring/s01-log-co-cau-truc.mjs';
import s02 from './observability-monitoring/s02-duong-ong-log.mjs';
import s03 from './observability-monitoring/s03-correlation.mjs';
import s04 from './observability-monitoring/s04-chi-so.mjs';
import s05 from './observability-monitoring/s05-chi-so-nodejs.mjs';
import s06 from './observability-monitoring/s06-trace.mjs';
import s07 from './observability-monitoring/s07-loi-sentry.mjs';
import s08 from './observability-monitoring/s08-suc-khoe.mjs';
import s09 from './observability-monitoring/s09-canh-bao.mjs';
import s10 from './observability-monitoring/s10-bang-theo-doi.mjs';
import s11 from './observability-monitoring/s11-chan-doan.mjs';
import s12 from './observability-monitoring/s12-tong-ket.mjs';

export default {
  category: { slug: 'devops', name: 'DevOps & Vận hành', icon: 'Server', sortOrder: 4 },
  course: {
    slug: 'observability-monitoring',
    title: 'Observability & Monitoring (Node.js trên VPS)',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/observability-monitoring.png?v=3',
    shortDescription: 'Logs, metrics, traces and alerts for a Node.js backend you run yourself. Every output block is a real measurement, including the ones that contradict the usual advice.|||Log, chỉ số, trace và cảnh báo cho một backend Node.js bạn tự vận hành. Mọi khối output đều là đo thật, kể cả những cái đi ngược lời khuyên thường nghe.',
    description: 'Khoá Observability & Monitoring cho backend Node.js tự vận hành trên VPS. 13 mục: log có cấu trúc và chi phí thật của nó, đường ống log tới nơi đọc được, correlation bằng AsyncLocalStorage, chỉ số và bùng nổ cardinality, chỉ số riêng của Node (độ trễ vòng lặp, heap, GC), trace phân tán và lấy mẫu, lỗi với Sentry, kiểm tra sức khoẻ và probe, cảnh báo dựa trên SLO, bảng theo dõi, và chẩn đoán sự cố. Số đo thật từ chính kho này: 945 khai báo route mà chỉ 16/73 file routes có import logger, 370 lời gọi logger so với 41 console, và bốn endpoint health mà một cái nói dối.',
    tags: 'observability,monitoring,logging,metrics,tracing,opentelemetry,sentry,prometheus,alerting,slo,nodejs',
  },
  sections: [s00, s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12],
};
