/**
 * Chương 6 — Transaction và tính nhất quán (soạn 24/11/2026, agent mgo). Bài tách ở ./s06/.
 * Output thật: ./_ma.mjs OUT['s06-*'] (scratchpad/mgo/demo/s06/*.txt). PHẢI chạy theo thứ tự tên: s06-1 tự nạp lại CT Shop (ghi ở ch6);
 * s06-1b chạy máy chủ HTTP thử ở 127.0.0.1:47099; s06-2/2b (2b dựng + xoá container phụ mgo-sa standalone); s06-3 dựng cụm mgo-rs3 (ba mongod
 * trong một container --network none, _demo/rs3.sh) và s06-4 dùng tiếp rồi xoá cụm; s06-5 lab (database lab6). Cả chương ~5 phút ⇒ chạy nền.
 * Tệp lab mới (phát cho người học): _demo/gio-ver.js, chuyen-tho.js, chuyen-tx.js, rs3.sh; _demo/node/gio-409.mjs, tx-dat-hang.mjs,
 * tx-quen-session.mjs, nhan-qua.mjs, lab6-thu.mjs, lab6-ngay-tho.mjs, lab6-giai.mjs (ba tệp lab6 chép nguyên vào 6.5 bằng scratchpad/mgo/tmp/dung-lab6.py).
 * Bài mốc mgo-moc-6 sinh từ ./_du-an.mjs.
 */
import L1 from './s06/mgo-6-1-nguyen-tu-mot-tai-lieu.mjs';
import L2 from './s06/mgo-6-2-transaction.mjs';
import L3 from './s06/mgo-6-3-write-concern.mjs';
import L4 from './s06/mgo-6-4-read-concern.mjs';
import L5 from './s06/mgo-6-5-lab.mjs';
import L6 from './s06/mgo-6-6-quiz.mjs';

export default { lessons: [L1, L2, L3, L4, L5, L6] };
