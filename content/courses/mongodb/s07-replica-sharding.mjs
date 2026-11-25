/**
 * Chương 7 — Replica set và sharding (soạn 24/11/2026, agent mgo). Bài tách ở ./s07/.
 * Output thật: ./_ma.mjs OUT['s07-*'] (scratchpad/mgo/demo/s07/*.txt, chạy bằng scratchpad/mgo/demo/chay-s07.sh — GIỮ CẢ HAI khe khoá nặng vì
 * Compose tạo/xoá mạng docker). Thứ tự: s07-1 dựng cụm rs1 (ba container mgo-r1/r2/r3, _demo/rs/compose.yaml) → s07-2 chuyển dự phòng (ứng dụng
 * _demo/node/ghi-lien-tuc.mjs chạy trong mạng cụm, sự cố bằng _demo/rs/hon-loan.sh) → s07-3 loại thành viên rồi xoá cụm → s07-4 dựng cụm shard
 * (mgo-cfg, mgo-s1/s2/s3, mgo-mongos; _demo/shard/compose.yaml, dữ liệu _demo/shard/don-shard.js) → s07-5 shard key rồi xoá cụm → s07-6 lab
 * (dựng lại rs1; _demo/node/lab7.mjs + lab7-ngay-tho.mjs + lab7-giai.mjs). Cả chương ~25 phút.
 * Bài mốc mgo-moc-7 sinh từ ./_du-an.mjs.
 */
import L1 from './s07/mgo-7-1-replica-set.mjs';
import L2 from './s07/mgo-7-2-failover.mjs';
import L3 from './s07/mgo-7-3-thanh-vien.mjs';
import L4 from './s07/mgo-7-4-sharding.mjs';
import L5 from './s07/mgo-7-5-shard-key.mjs';
import L6 from './s07/mgo-7-6-lab.mjs';
import L7 from './s07/mgo-7-7-quiz.mjs';

export default { lessons: [L1, L2, L3, L4, L5, L6, L7] };
