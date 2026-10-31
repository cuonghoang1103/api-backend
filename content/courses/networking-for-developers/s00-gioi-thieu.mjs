/**
 * Networking for Developers — Mục 0 (soạn trọn 31/10/2026, đợt mẫu). Mỗi bài một tệp trong ./bai/ cho dễ soạn và soát.
 * GIỮ NGUYÊN title chương + slug bài của khung (seeder neo bằng chúng).
 */
import b0a from './bai/00a-bat-dau-tai-day.mjs';
import b0b from './bai/00b-bat-dau-su-co.mjs';
import b01 from './bai/001-cai-dat.mjs';
import b02 from './bai/002-go-dia-chi.mjs';
import q0 from './bai/003-quiz-muc0.mjs';

export default {
  title: 'Section 0 — Why developers need networking|||Mục 0 — Vì sao lập trình viên cần hiểu mạng',
  description: 'Mạng là gì bằng lời đời thường, Internet ra đời thế nào, những sự cố thật và cách học không nản; dựng phòng lab Docker (client — router — nginx — API) và lần theo một URL qua từng chặng có bấm giờ.',
  lessons: [b0a, b0b, b01, b02, q0],
};
