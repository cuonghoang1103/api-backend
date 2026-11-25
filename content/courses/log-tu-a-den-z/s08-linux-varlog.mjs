/**
 * Chương 8 — Linux (2): /var/log, syslog, log xác thực, auditd và logrotate (soạn chi tiết 24/11/2026, agent lgz). Bài tách ở ./s08/.
 * Lệnh + output thật: ./_ma.mjs — sinh từ ./_demo/s08/ (máy ảo lab7 Ubuntu 24.04 của Chương 7 + máy ảo thứ hai "keodo" làm kẻ dò
 * trong mạng lab 192.168.56.0/24 + container lgz-logsrv làm máy chủ log trung tâm; cấu hình ở _demo/s08/vm/ và _demo/s08/logsrv/).
 * Tệp lệnh đuôi .bash chạy bằng _demo/s08/cong-cu/chay-vm.py (tiền tố @keodo/@logsrv/@host chọn máy), rồi scripts/log-khoa/sinh-ma.mjs.
 * Thứ tự quan trọng: chuan-bi → var-log → rsyslog → auth → auditd(→ khởi động lại máy ảo gỡ -e 2) → auditd2/3 → logrotate
 *   → lab8-tan-cong → lab8 → lab8-ngan (chạy một lần) → auth2, auditd4 (chạy sau, số đếm gồm cả Lab 8).
 */
import L81 from './s08/log-8-1-var-log.mjs';
import L82 from './s08/log-8-2-rsyslog.mjs';
import L83 from './s08/log-8-3-auth-log.mjs';
import L84 from './s08/log-8-4-auditd.mjs';
import L85 from './s08/log-8-5-logrotate.mjs';
import L86 from './s08/log-8-6-lab.mjs';
import L87 from './s08/log-8-7-quiz.mjs';

export default { lessons: [L81, L82, L83, L84, L85, L86, L87] };
