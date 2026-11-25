/**
 * Chương 11 — Dự án cuối khoá và phỏng vấn (soạn 25/11/2026, tiếp quản agent mgo — chạy demo trên máy nhà, mgo-lab MongoDB 8.0.38). Bài tách ở ./s11/.
 * Output thật: ./_ma.mjs OUT['s11-*'] (kịch bản scratchpad/mgo/demo/s11/*.txt trên máy nhà; gộp vào _ma.mjs bằng cách THÊM khoá, không sinh lại cả tệp).
 * Tệp phụ _demo/: kiem-du-an.js + truy-van-ctshop.js (11.1), pe11/ (11.2: nap.js, cham.sh, cham.js, dong.js, loi-giai/, bai-lam-ngay-tho/).
 * Bài 11.1 và 11.2 đọc tệp _demo NGUYÊN VĂN lúc nạp module (fs) — sửa tệp demo là bài tự đổi theo; nhớ chạy lại kịch bản để output khớp.
 * Bài mgo-bao-ve-du-an (cuối chương) sinh từ ./_du-an.mjs.
 */
import L1 from './s11/mgo-11-1-de-bai.mjs';
import L2 from './s11/mgo-11-2-thi-thuc-hanh.mjs';
import L3 from './s11/mgo-11-3-phong-van.mjs';
import L4 from './s11/mgo-11-4-thi-cuoi-khoa.mjs';

export default { lessons: [L1, L2, L3, L4] };
