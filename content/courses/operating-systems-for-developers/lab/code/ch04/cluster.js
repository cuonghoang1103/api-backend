// cluster.js — máy chủ HTTP mà mỗi request đốt ~20 ms CPU (kiểu băm mật khẩu, co ảnh). W tiến trình worker cùng nghe
// MỘT cổng 8080: tiến trình chính (primary) nhận kết nối rồi chia vòng tròn cho các worker.
//   node cluster.js W        (W = 0: KHÔNG cluster — máy chủ chạy ngay trong một tiến trình, để so)
const cluster = require('node:cluster');
const http = require('node:http');
const W = Number(process.argv[2] ?? 1);

function serve() {
  http.createServer((req, res) => {
    const end = performance.now() + 20;
    let x = 0;
    while (performance.now() < end) x++;          // 20 ms CPU thuần — chặn event loop của tiến trình này
    res.end(`pid ${process.pid}\n`);
  }).listen(8080);
}

if (W === 0) {
  serve();
  console.log(`single process ${process.pid} listening on :8080 (no cluster)`);
} else if (cluster.isPrimary) {
  for (let i = 0; i < W; i++) cluster.fork();
  let up = 0;
  cluster.on('listening', () => { if (++up === W) console.log(`primary ${process.pid}: ${W} worker(s) listening on :8080`); });
} else {
  serve();
}
