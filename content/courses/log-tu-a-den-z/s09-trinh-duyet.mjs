/**
 * Chương 9 — Trình duyệt: Console, Network, HAR và lỗi phía giao diện (soạn chi tiết 24/11/2026, agent lgz). Bài tách ở ./s09/.
 * Lệnh + output thật: ./_ma.mjs — sinh từ ./_demo/s09/ (Lab 9: Node 22 server.mjs + Google Chrome 150 headless qua Playwright/CDP,
 * Firefox 152 MOZ_LOG, jq 1.7). Chạy lại cả chương: bash _demo/s09/chay-s09.bash <thư mục làm việc> (cần playwright-core + esbuild
 * trong thư mục đó), rồi sinh lại _ma.mjs. Tệp lệnh đuôi .bash (như s07/s08/s10) để chay-demo.py không chạy nhầm.
 * Liên kết chéo khoá debug-co-phuong-phap Ch5 (Console/Network/Application ở góc GỠ LỖI) — ở đây ĐỌC như log.
 */
import L91 from './s09/log-9-1-console.mjs';
import L92 from './s09/log-9-2-network.mjs';
import L93 from './s09/log-9-3-har.mjs';
import L94 from './s09/log-9-4-net-export.mjs';
import L95 from './s09/log-9-5-loi-nguoi-dung.mjs';
import L96 from './s09/log-9-6-lab.mjs';
import L97 from './s09/log-9-7-quiz.mjs';

export default { lessons: [L91, L92, L93, L94, L95, L96, L97] };
