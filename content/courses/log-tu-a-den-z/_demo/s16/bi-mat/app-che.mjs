// app-che.mjs — cùng API, có lớp che: redact đường dẫn cố định + serializer bỏ query string + chỉ log trường cần.
import http from 'node:http';
import pino from 'pino';
import pinoHttp from 'pino-http';

const log = pino({
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]', '*.password', '*.token'],
    censor: '[ĐÃ CHE]',
  },
});
const httpLog = pinoHttp({
  logger: log,
  serializers: {
    req: (req) => ({ id: req.id, method: req.method, url: req.url.split('?')[0], headers: req.headers, remoteAddress: req.remoteAddress }),
  },
});

const server = http.createServer((req, res) => {
  httpLog(req, res);
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    const data = body ? JSON.parse(body) : {};
    req.log.info({ body: data, userId: 'u_42' }, 'đăng nhập');   // password trong body bị che bởi *.password
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
