/**
 * Chương 18 — Dự án cuối khoá: điều tra một sự cố đa nguồn và viết báo cáo (soạn chi tiết 24/11/2026, agent lgz). Bài tách ở ./s18/.
 * Lệnh + output thật: ./_ma.mjs — sinh từ ./_demo/s18/ (chạy lại: bash _demo/s18/chay-s18.bash; rồi sinh-ma). Dữ liệu:
 *  - su-co18 (công ty giả định Hoa Sen Travel: vps01 + rt01 + PC-DEV01): log SINH tất định bởi _demo/s18/tao-su-co.py, đúng định dạng rsyslog/journald Ubuntu 24.04,
 *    nginx, docker json-file + pino, PostgreSQL 16 csvlog (đối chiếu postgres:16.16 thật), OpenWrt logread, Get-WinEvent → JSON. Không dựng tấn công thật.
 *  - Môi trường chạy: lgz-c03 (ảnh lgz-win-mau:1) dùng chung netns với lgz-c18-loki (grafana/loki:3.7.10), cả hai --network none, ≤ 2 GB.
 * ATT&CK kiểm attack.mitre.org 24/11/2026 (v19.2): 19 kỹ thuật ở _demo/s18/mau/attack-su-co18.tsv.
 */
import L181 from './s18/log-18-1-de-bai.mjs';
import L182 from './s18/log-18-2-thu-thap.mjs';
import L183 from './s18/log-18-3-dieu-tra.mjs';
import L184 from './s18/log-18-4-dong-thoi-gian.mjs';
import L185 from './s18/log-18-5-bao-cao.mjs';
import L186 from './s18/log-18-6-tu-dung-kich-ban.mjs';
import L187 from './s18/log-18-7-thi-cuoi.mjs';

export default { lessons: [L181, L182, L183, L184, L185, L186, L187] };
