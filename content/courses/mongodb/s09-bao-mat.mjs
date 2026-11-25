/**
 * Chương 9 — Bảo mật (soạn 24/11/2026, agent mgo). Bài tách ở ./s09/.
 * Output thật: ./_ma.mjs OUT['s09-*'] (scratchpad/mgo/demo/s09/*.txt, chạy bằng chay.py theo thứ tự; s09-1 tự nạp lại CT Shop). Cả chương ~4 phút; mgo-lab phải đang chạy.
 * Container phụ (tự dựng + xoá): mgo-mo-cong (chỉ create), mgo-mac-dinh, mgo-nen, mgo-cung, mgo-cu (ảnh mongo:8.0.16 có sẵn trên máy, --network none), mgo-auth (47023),
 * mgo-tro (47027), mgo-tls (47028), mgo-vet, mgo-lab9 (47093). Tiến trình Node: API lỗi 47024, API vá 47025, proxy nghe lén 47026, lab9 47091/47092.
 * Tệp phụ: _demo/tu-kiem.js, _demo/tls/tao-chung-chi.sh (KHÔNG kéo ca.key/ca.pem/may-chu.*), _demo/csfle/{package.json,package-lock.json,ma-hoa.mjs} (KHÔNG kéo node_modules),
 * _demo/node/{s09-api-lo,s09-api-va,s09-mg-sanitize,s09-nghe-len,lab9-du-lieu,lab9-ngay-tho,lab9-giai,lab9-thu}.mjs, _demo/lab9-may-chu.sh.
 * CHỈ PHÒNG THỦ với CVE-2025-14847: không mô tả cách khai thác. Bài mốc mgo-moc-9 sinh từ ./_du-an.mjs.
 */
import L1 from './s09/mgo-9-1-su-co-that.mjs';
import L2 from './s09/mgo-9-2-xac-thuc-phan-quyen.mjs';
import L3 from './s09/mgo-9-3-nosql-injection.mjs';
import L4 from './s09/mgo-9-4-ma-hoa-kiem-toan.mjs';
import L5 from './s09/mgo-9-5-lab.mjs';
import L6 from './s09/mgo-9-6-quiz.mjs';

export default { lessons: [L1, L2, L3, L4, L5, L6] };
