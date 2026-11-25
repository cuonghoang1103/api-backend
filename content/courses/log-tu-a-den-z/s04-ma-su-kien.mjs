/**
 * Chương 4 — Windows (2): những mã sự kiện phải thuộc (soạn chi tiết 24/11/2026, agent lgz). Bài tách ở ./s04/.
 * Lệnh + output thật: ./_ma.mjs — sinh từ ./_demo/s04/ trên BỘ EVTX MẪU CÔNG KHAI: 17 tệp của Ch3 (/lab/mau) + 40 tệp tấn công/cấu hình của Ch4 (/lab/tc,
 * Yamato-Security/hayabusa-sample-evtx: EVTX-ATTACK-SAMPLES, EVTX-to-MITRE-Attack, DeepBlueCLI, Yamato Security; tải + kiểm SHA256 bằng _demo/s04/mau/tai-mau-ch4.ps1.txt — chạy thật 40 OK).
 * Đọc bằng evtx-rec (pyevtx-rs) trong PowerShell 7, container lgz-c03 (ảnh lgz-win-mau:1). Chạy lại: bash _demo/s04/cong-cu/ct.bash; python3 _demo/s03/cong-cu/chay-mau.py _demo/s04/<tệp>.bash; rồi sinh-ma.
 * Sự kiện KHÔNG có trong bộ mẫu công khai (4740/4767, 41/6008/BugCheck 1001, 7034/7031, 1026, 5001) — bài đếm thật ra 0 và giảng theo Microsoft Learn; người học tự tạo trong Lab 4 (máy ảo).
 * Bảng GUID audit policy: _demo/s04/mau/guid-auditpol.tsv (từ [MS-GPAC]). ATT&CK đã đánh số lại (kiểm 24/11/2026): T1070.001→T1685.005, T1562.001→T1685, T1562.002→T1685.001.
 */
import L41 from './s04/log-4-1-dang-nhap.mjs';
import L42 from './s04/log-4-2-tai-khoan-dac-quyen.mjs';
import L43 from './s04/log-4-3-xoa-log-chinh-sach.mjs';
import L44 from './s04/log-4-4-tat-may.mjs';
import L45 from './s04/log-4-5-dich-vu-ung-dung.mjs';
import L46 from './s04/log-4-6-tien-trinh-tac-vu.mjs';
import L47 from './s04/log-4-7-rdp-tu-xa.mjs';
import L48 from './s04/log-4-8-defender-update.mjs';
import L49 from './s04/log-4-9-lab.mjs';
import L410 from './s04/log-4-10-quiz.mjs';

export default { lessons: [L41, L42, L43, L44, L45, L46, L47, L48, L49, L410] };
