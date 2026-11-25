/**
 * Chương 5 — Aggregation pipeline (soạn chi tiết 24/11/2026, agent mgo). Bài tách ở ./s05/.
 * Output thật: ./_ma.mjs OUT['s05-*'] (scratchpad/mgo/demo/s05/*.txt; s05-1-co-ban tự nạp lại CT Shop + 1.000.000 đơn ch4 — PHẢI chạy 1→6 theo thứ tự;
 * s05-2 tạo/xoá ch5.donThu, ch4.k20, ctshop.vung; s05-5 tạo index ch4.don { trangThai, ngay } và container phụ mgo-js --noscripting (xoá ngay);
 * s05-6 tạo/xoá index ctshop.orders { status, createdAt } + doanhThuNgay). Bài mốc mgo-moc-5 sinh từ ./_du-an.mjs.
 * Tệp lab mới: _demo/ke-pipeline.js (công cụ đọc explain pipeline, Bài 5.5 + lab), _demo/lab5-giai.js (lời giải, chép nguyên vào GIAI_MA của 5.6 — sửa tệp thì chép lại).
 */
import L1 from './s05/mgo-5-1-pipeline-co-ban.mjs';
import L2 from './s05/mgo-5-2-unwind-lookup.mjs';
import L3 from './s05/mgo-5-3-bieu-thuc.mjs';
import L4 from './s05/mgo-5-4-window.mjs';
import L5 from './s05/mgo-5-5-toi-uu.mjs';
import L6 from './s05/mgo-5-6-lab.mjs';
import L7 from './s05/mgo-5-7-quiz.mjs';

export default { lessons: [L1, L2, L3, L4, L5, L6, L7] };
