// server.js — một máy chủ HTTP tí hon để soi bằng /proc
const http = require('http');
const server = http.createServer((req, res) => res.end('hello\n'));
server.listen(8080, () => console.log(`pid ${process.pid} listening on 8080`));
process.on('SIGTERM', () => {               // tắt êm: ngừng nhận kết nối mới, xong việc đang dở rồi mới thoát
  console.log('SIGTERM received, closing…');
  server.close(() => { console.log('bye'); process.exit(0); });
});
