/**
 * Chương 7 — Linux (1): journald và journalctl chuyên sâu (soạn chi tiết 24/11/2026, agent lgz). Bài tách ở ./s07/.
 * Lệnh + output thật: ./_ma.mjs — sinh từ ./_demo/s07/ (máy ảo Ubuntu 24.04 thật "lab7": systemd 255, nhân 6.8, KVM; app thử + unit ở _demo/s07/vm/).
 * Tệp lệnh đuôi .bash chạy TRONG máy ảo bằng cong-cu chay-vm.py (mỗi dòng một lệnh qua ssh), rồi scripts/log-khoa/sinh-ma.mjs.
 * Lịch sử máy ảo là một phần của bài (thứ tự quan trọng): rút điện → thử volatile → khởi động lại sạch → bài 7.1–7.5 → tua giờ tới 03:11:40 cho Lab 7.
 */
import L71 from './s07/log-7-1-journald-luu.mjs';
import L72 from './s07/log-7-2-journalctl-loc.mjs';
import L73 from './s07/log-7-3-journalctl-xuat.mjs';
import L74 from './s07/log-7-4-journald-cau-hinh.mjs';
import L75 from './s07/log-7-5-kernel-dmesg.mjs';
import L76 from './s07/log-7-6-lab.mjs';
import L77 from './s07/log-7-7-quiz.mjs';

export default { lessons: [L71, L72, L73, L74, L75, L76, L77] };
