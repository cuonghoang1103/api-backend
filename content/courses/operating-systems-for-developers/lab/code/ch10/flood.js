// flood.js ignore|respect — máy chủ gửi 256 MiB cho MỘT khách đọc chậm (1 MiB/s).
//   ignore : write() liên tục, mặc kệ giá trị trả về  ⇒ dữ liệu dồn trong bộ nhớ của Node
//   respect: write() trả false thì DỪNG, chờ 'drain' ⇒ backpressure
const net = require('node:net');
const mode = process.argv[2], total = 4096;                                      // 4096 × 64 KiB = 256 MiB
const mb = (x) => (x / 1048576).toFixed(0).padStart(4);
net.createServer((sock) => {
  let sent = 0;
  const t0 = Date.now();
  const report = setInterval(() => {
    console.log(`${mode} t=${((Date.now() - t0) / 1000).toFixed(1)}s  queued in Node: ${mb(sock.writableLength)} MiB  RSS: ${mb(process.memoryUsage().rss)} MiB  chunks written: ${sent}`);
  }, 1000);
  const pump = () => {
    while (sent < total) {
      sent++;
      const ok = sock.write(Buffer.alloc(64 * 1024, sent));          // mỗi khối là dữ liệu MỚI (như trang HTML vừa dựng)
      if (!ok && mode === 'respect') return sock.once('drain', pump);   // bộ đệm đầy: đợi
    }
  };
  pump();
  sock.on('close', () => clearInterval(report));
  sock.on('error', () => {});
  setTimeout(() => { clearInterval(report); process.exit(0); }, 3300);
}).listen(7600, () => console.log(`flood (${mode}) listening on 7600, highWaterMark ${new net.Socket().writableHighWaterMark} bytes`));
