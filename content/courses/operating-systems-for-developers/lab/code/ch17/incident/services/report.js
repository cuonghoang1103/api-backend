// report.js — dịch vụ báo cáo (cổng 3001). Mỗi request đọc mẫu báo cáo từ đĩa rồi điền số liệu.
const http = require('node:http');
const fs = require('node:fs');

function loadTemplate() {
  const fd = fs.openSync('/app/template.html', 'r');
  const buf = Buffer.alloc(4096);
  const n = fs.readSync(fd, buf, 0, buf.length, 0);
  return buf.subarray(0, n).toString();
}

http.createServer((req, res) => {
  if (req.url === '/healthz') return res.end('ok\n');
  if (req.url.startsWith('/report')) {
    try {
      const html = loadTemplate().replace('{{total}}', String(Math.floor(Math.random() * 1e6)));
      return res.end(html);
    } catch (e) {
      console.error(new Date().toISOString(), 'report failed:', e.code, e.message);
      res.statusCode = 500; return res.end('error: ' + e.code + '\n');
    }
  }
  res.statusCode = 404; res.end('not found\n');
}).listen(3001, () => console.log('report listening on 3001'));
