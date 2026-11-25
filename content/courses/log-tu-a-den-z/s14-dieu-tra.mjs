/**
 * Chương 14 — Điều tra bảo mật bằng log (soạn chi tiết 24/11/2026, agent lgz). Bài tách ở ./s14/.
 * Lệnh + output thật: ./_ma.mjs — sinh từ ./_demo/s14/ (chạy lại: bash _demo/s14/chay-s14.bash; rồi sinh-ma). Dữ liệu:
 *  - vu14 (vụ web01, bài 14.1–14.7) + lab14 (vụ api02, Lab 14): log SINH bởi _demo/s14/tao-vu.py (tất định, chỉ thư viện chuẩn, đúng định dạng Ubuntu 24.04/nginx/pino/auditd —
 *    đối chiếu log thật của máy ảo Ch7–8). Không dựng tấn công thật lên máy thật (bộ lọc an toàn đã dừng cách đó ở phiên 12).
 *  - Windows: bộ EVTX mẫu công khai của Ch3 (17 tệp) + Ch4 (40 tệp, Yamato-Security/hayabusa-sample-evtx), đọc bằng evtx-rec trong container lgz-c03 (_demo/s14/cong-cu/ct.bash, --network none, 2 GB).
 *  - 6 quy tắc SigmaHQ (tải 24/11/2026, _demo/s14/mau/sigma/), chấm bằng _demo/s14/mau/sigma-mini.py tự viết.
 * ATT&CK kiểm attack.mitre.org 24/11/2026: v19.2, chiến thuật Stealth + Defense Impairment, T1685.004/.005/.006.
 */
import L141 from './s14/log-14-1-brute-force.mjs';
import L142 from './s14/log-14-2-dang-nhap-la.mjs';
import L143 from './s14/log-14-3-leo-thang.mjs';
import L144 from './s14/log-14-4-xoa-dau-vet.mjs';
import L145 from './s14/log-14-5-dong-thoi-gian.mjs';
import L146 from './s14/log-14-6-mitre-attack.mjs';
import L147 from './s14/log-14-7-siem-sigma.mjs';
import L148 from './s14/log-14-8-lab.mjs';
import L149 from './s14/log-14-9-quiz.mjs';

export default { lessons: [L141, L142, L143, L144, L145, L146, L147, L148, L149] };
