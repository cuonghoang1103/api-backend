/**
 * Chương 1 — Mô hình tài liệu và BSON (soạn chi tiết 24/11/2026, agent mgo). Bài tách ở ./s01/.
 * Output thật: ./_ma.mjs OUT['s01-*'] (scratchpad/mgo/demo/s01/*.txt). Bài mốc mgo-moc-1 sinh từ ./_du-an.mjs, không ở đây.
 */
import L1 from './s01/mgo-1-1-tai-lieu-collection.mjs';
import L2 from './s01/mgo-1-2-bson-kieu-du-lieu.mjs';
import L3 from './s01/mgo-1-3-schema-validation.mjs';
import L4 from './s01/mgo-1-4-wiredtiger.mjs';
import L5 from './s01/mgo-1-5-lab.mjs';
import L6 from './s01/mgo-1-6-quiz.mjs';

export default { lessons: [L1, L2, L3, L4, L5, L6] };
