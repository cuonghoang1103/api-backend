// chup-anh.js — "dịch vụ chụp ảnh trang" giả lập (kiểu Puppeteer/Playwright trong Docker): mỗi 50 ms mở một "trình duyệt"
// (sh) — trình duyệt đẻ một tiến trình phụ chạy nền (như crashpad/zygote của Chromium) rồi thoát ngay.
// Tiến trình phụ mồ côi ⇒ được giao cho PID 1. Nếu PID 1 là chính node (không có init) thì không ai wait() nó ⇒ zombie.
const { spawn } = require('child_process');
let ok = 0, fail = 0;
setInterval(() => {
  const p = spawn('sh', ['-c', 'sleep 0.2 & exit 0'], { stdio: ['ignore', 'ignore', 'inherit'] });       // "trình duyệt" + tiến trình phụ chạy nền
  p.on('spawn', () => { ok++; });
  p.on('error', (e) => { if (++fail <= 2) console.error(`spawn failed: ${e.code}`); });
}, 50);
setInterval(() => console.log(`pid=${process.pid} started=${ok} failed=${fail}`), 2000);
