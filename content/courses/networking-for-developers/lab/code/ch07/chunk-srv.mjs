// Ch7 · máy chủ phát từng khúc (streaming): KHÔNG đặt Content-Length ⇒ HTTP/1.1 dùng Transfer-Encoding: chunked.
import http from 'node:http';
http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.write('khuc-1 (gui ngay)\n');
  setTimeout(() => { res.write('khuc-2 (gui sau 50ms)\n'); res.end('khuc-3 (het)\n'); }, 50);
}).listen(4100, '0.0.0.0', () => console.log('chunk server on :4100'));
