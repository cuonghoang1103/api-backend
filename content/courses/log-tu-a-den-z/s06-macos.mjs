/**
 * Chương 6 — macOS: unified logging và Console (soạn chi tiết 25/11/2026, agent trên Mac tiếp quản lgz — máy nhà Linux không chạy được demo macOS).
 * Bài tách ở ./s06/. Lệnh + output THẬT: ./_ma.mjs — sinh từ ./_demo/s06/*.zsh chạy trên MacBook thật (macOS 27.2.1, Apple Silicon)
 * bằng `zsh _demo/s06/chay-s06.zsh [thư-mục-làm-việc]` (không sudo, không đổi cấu hình), rồi `node scripts/log-khoa/sinh-ma.mjs`.
 * Đuôi .zsh cố ý: scripts/log-khoa/chay-demo.sh (chạy trong container Linux) chỉ quét .sh/.ps1 nên không ghi đè output Mac.
 * Ẩn danh: _demo/s06/app/an-danh.pl (tên máy ⇒ macbook-lab, home ⇒ /Users/sv, tài khoản ⇒ sv, UUID/IP/MAC/email giả) — đọc giá trị thật từ môi trường lúc chạy.
 * Ứng dụng thử: _demo/s06/app/shopmac.swift (Logger + privacy), motep.swift (văng khi đọc tệp cấu hình hỏng ⇒ .ips thật).
 */
import L61 from './s06/log-6-1-unified-logging.mjs';
import L62 from './s06/log-6-2-console-app.mjs';
import L63 from './s06/log-6-3-log-show-stream.mjs';
import L64 from './s06/log-6-4-predicate.mjs';
import L65 from './s06/log-6-5-bao-mat-mac.mjs';
import L66 from './s06/log-6-6-lab.mjs';
import L67 from './s06/log-6-7-quiz.mjs';

export default { lessons: [L61, L62, L63, L64, L65, L66, L67] };
