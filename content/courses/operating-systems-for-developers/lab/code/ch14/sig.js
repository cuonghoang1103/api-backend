// sig.js — một "máy chủ" tí hon dừng êm khi nhận SIGTERM hoặc SIGINT (Chương 14, bài 14.2).
// Cùng một file chạy y nguyên trên macOS và Linux. Trên Windows chỉ Ctrl+C (SIGINT) và Ctrl+Break (SIGBREAK) tới được
// handler; process.kill(pid, 'SIGTERM') ở đó là TerminateProcess — không handler nào được gọi (tài liệu Node).
const t0 = Date.now();
for (const s of ['SIGTERM', 'SIGINT']) {
  process.on(s, () => {
    console.log(`${s} after ${Date.now() - t0} ms on ${process.platform} — closing cleanly`);
    process.exit(0);
  });
}
console.log(`pid ${process.pid} running on ${process.platform}/${process.arch}`);
setInterval(() => {}, 1000);
