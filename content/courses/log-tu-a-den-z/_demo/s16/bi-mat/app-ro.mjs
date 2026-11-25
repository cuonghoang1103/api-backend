// app-ro.mjs — API đăng nhập ghi log "cho dễ gỡ lỗi": LỌT mật khẩu, token, cookie. Chạy: node app-ro.mjs (tự gọi chính nó rồi thoát)
import http from 'node:http';
import pino from 'pino';
import pinoHttp from 'pino-http';

const log = pino();
const httpLog = pinoHttp({ logger: log });

const server = http.createServer((req, res) => {
  httpLog(req, res);
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    const data = body ? JSON.parse(body) : {};
    req.log.info({ body: data }, 'đăng nhập');           // ✗ ghi nguyên body
    res.end('{"ok":true}');
  });
});

server.listen(0, '127.0.0.1', async () => {
  const { port } = server.address();
  await fetch(`http://127.0.0.1:${port}/api/login?token=sk_test_GIA_TOKEN·VIDU_51a9`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1XzQyIn0.GIA-chu-ky', cookie: 'sid=GIA-phien-7f3c' },
    body: JSON.stringify({ email: 'an.nguyen@example.com', password: 'MatKhau-GIA-123' }),
  });
  server.close();
});
