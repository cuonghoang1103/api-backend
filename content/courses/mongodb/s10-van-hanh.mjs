/**
 * Chương 10 — Vận hành: sao lưu, giám sát, hiệu năng và đo tải (soạn 24/11/2026, agent mgo). Bài tách ở ./s10/.
 * Output thật: ./_ma.mjs OUT['s10-*'] (scratchpad/mgo/demo/s10/*.txt, chạy bằng chay.py theo thứ tự; s10-1 tự nạp lại CT Shop). Cả chương ~15 phút; mgo-lab phải đang chạy
 * (compose giới hạn 2 GB/2 CPU). Container phụ (tự dựng + xoá, đều có --memory/--cpus): mgo-kp, mgo-kp2, mgo-kt (sao lưu), mgo-xuat (exporter Percona 0.47),
 * mgo-ws (768 MB) + mgo-ws0 (3 GB, cache 1,5 GB — đối chứng) + mgo-ws-node/mgo-ws0-node, mgo-tai + mgo-tai-node (đo tải), mgo-don (standalone), mgo-fcv (ảnh 6.0/7.0/8.0), mgo-l10kp (lab).
 * Tệp phụ _demo/: sao-luu.sh, kiem-khoi-phuc.sh, ghi-don.js, suc-khoe.js, cache-dem.js, ws-nap.js, don-trieu.js, ts-nap.js, lab10-su-co.{sh,js}, lab10-cham.sh,
 * lab10-ngay-tho.sh, lab10-giai.sh, rs3.sh (thêm giới hạn bộ nhớ); _demo/node/: tai.mjs, giu-ket-noi.mjs, theo-doi.mjs.
 * Bài mốc mgo-moc-10 sinh từ ./_du-an.mjs.
 */
import L1 from './s10/mgo-10-1-sao-luu.mjs';
import L2 from './s10/mgo-10-2-giam-sat.mjs';
import L3 from './s10/mgo-10-3-hieu-nang.mjs';
import L4 from './s10/mgo-10-4-do-tai.mjs';
import L5 from './s10/mgo-10-5-change-stream-time-series.mjs';
import L6 from './s10/mgo-10-6-nang-cap-atlas.mjs';
import L7 from './s10/mgo-10-7-lab.mjs';
import L8 from './s10/mgo-10-8-quiz.mjs';

export default { lessons: [L1, L2, L3, L4, L5, L6, L7, L8] };
