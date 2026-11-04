// Ch4 · 4.5 — pool kết nối: cùng một máy chủ đếm xem 4 yêu cầu dùng bao nhiêu KẾT NỐI TCP (theo cổng nguồn).
// keepAlive=false ⇒ mỗi yêu cầu bắt tay lại (4 kết nối). keepAlive=true ⇒ một socket phục vụ cả 4.
import http from 'node:http';
const srv = http.createServer((req, res) => res.end('ok'));
const ports = new Set();
srv.on('connection', (s) => ports.add(s.remotePort));
srv.listen(0, '127.0.0.1', () => {
  const port = srv.address().port;
  const run = (keepAlive, n, done) => {
    ports.clear();
    const agent = new http.Agent({ keepAlive });
    let left = n;
    const one = () => http.get({ port, path: '/', agent }, (res) => { res.resume(); res.on('end', () => { if (--left) setTimeout(one, 30); else { console.log(`keepAlive=${keepAlive}: 4 yêu cầu ⇒ ${ports.size} kết nối TCP`); agent.destroy(); done(); } }); });
    one();
  };
  run(false, 4, () => run(true, 4, () => srv.close()));
});
