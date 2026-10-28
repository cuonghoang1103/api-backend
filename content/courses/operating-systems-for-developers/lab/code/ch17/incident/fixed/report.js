// report.js — ĐÃ SỬA (lời giải mẫu 17.3, sự cố 2: rò file descriptor ⇒ EMFILE "too many open files").
// Lỗi: openSync mỗi request mà không closeSync ⇒ mỗi request giữ thêm một fd; ulimit 256 ⇒ ~230 request là hết.
// Sửa: đọc mẫu MỘT lần lúc khởi động (nó không đổi). Nếu buộc phải mở mỗi lần: try { … } finally { fs.closeSync(fd) }.
const http = require('node:http');
const fs = require('node:fs');
const TEMPLATE = fs.readFileSync('/app/template.html', 'utf8');   // readFileSync tự mở VÀ tự đóng

http.createServer((req, res) => {
  if (req.url === '/healthz') return res.end('ok\n');
  if (req.url.startsWith('/report')) {
    return res.end(TEMPLATE.replace('{{total}}', String(Math.floor(Math.random() * 1e6))));
  }
  res.statusCode = 404; res.end('not found\n');
}).listen(3001, () => console.log('report listening on 3001'));
