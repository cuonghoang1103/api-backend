/**
 * Chương 4 — Index và explain (soạn chi tiết 24/11/2026, agent mgo). Bài tách ở ./s04/.
 * Output thật: ./_ma.mjs OUT['s04-*'] (scratchpad/mgo/demo/s04/*.txt; s04-1-idx tự nạp lại CT Shop + 1.000.000 đơn tất định bằng
 * _demo/don-trieu.js vào database ch4 — các kịch bản sau dùng ch4.don nên PHẢI chạy theo thứ tự 1→7; s04-4-dac dùng ch4x (dọn cuối);
 * s04-6-cham dựng + xoá container phụ mgo-maxt (--auth, --network none)). Bài mốc mgo-moc-4 sinh từ ./_du-an.mjs.
 * Tệp lab mới: _demo/don-trieu.js (dữ liệu lớn), _demo/lab4-do.js (công cụ đo, chép nguyên vào DO_MA của 4.7),
 * _demo/lab4-giai.js (lời giải, chép nguyên vào GIAI_MA của 4.7 — sửa tệp thì chép lại).
 */
import L1 from './s04/mgo-4-1-index-la-gi.mjs';
import L2 from './s04/mgo-4-2-explain.mjs';
import L3 from './s04/mgo-4-3-compound-esr.mjs';
import L4 from './s04/mgo-4-4-index-dac-biet.mjs';
import L5 from './s04/mgo-4-5-covered-chi-phi.mjs';
import L6 from './s04/mgo-4-6-truy-van-cham.mjs';
import L7 from './s04/mgo-4-7-lab.mjs';
import L8 from './s04/mgo-4-8-quiz.mjs';

export default { lessons: [L1, L2, L3, L4, L5, L6, L7, L8] };
