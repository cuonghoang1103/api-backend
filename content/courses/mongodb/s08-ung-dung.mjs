/**
 * Chương 8 — Từ ứng dụng: Node.js, Mongoose và Spring Data MongoDB (soạn 24/11/2026, agent mgo). Bài tách ở ./s08/.
 * Output thật: ./_ma.mjs OUT['s08-*'] (scratchpad/mgo/demo/s08/*.txt, chạy bằng chay.py theo thứ tự; s08-1 tự nạp lại CT Shop).
 * Chạy trên máy: Node 22 + mongodb 7.9.1 + mongoose 9.13.0 + express 5 (_demo/node), Mongoose 8.8.2 CÓ LỖI chỉ trong _demo/cve-2024-53900,
 * Spring Boot 4.1.2 + Spring Data MongoDB 5.1.2 + JDK 25 (_demo/spring: chay.sh, chay-lab8.sh; target/ KHÔNG kéo về). Cả chương ~6 phút.
 * Bài mốc mgo-moc-8 sinh từ ./_du-an.mjs.
 */
import L1 from './s08/mgo-8-1-driver-node.mjs';
import L2 from './s08/mgo-8-2-mongoose.mjs';
import L3 from './s08/mgo-8-3-mongoose-nang-cao.mjs';
import L4 from './s08/mgo-8-4-spring-data.mjs';
import L5 from './s08/mgo-8-5-lab.mjs';
import L6 from './s08/mgo-8-6-quiz.mjs';

export default { lessons: [L1, L2, L3, L4, L5, L6] };
