// Ch9 lab — máy chủ thời gian thực tí hon (:5100): polling, long-polling và SSE trên CÙNG một bộ đếm.
// Bộ đếm tăng 1 mỗi 2 giây. /poll trả ngay; /longpoll giữ tới khi bộ đếm đổi; /sse đẩy mỗi lần đổi trên MỘT kết nối.
import http from 'node:http';

let n = 0;
const waiters = [];               // long-poll đang chờ
const sseClients = new Set();     // kết nối SSE đang mở

setInterval(() => {
  n++;
  while (waiters.length) waiters.shift()({ n });                       // đánh thức long-poll
  for (const res of sseClients) res.write(`data: {"n":${n}}\n\n`);     // đẩy cho SSE
}, 2000);

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');

  if (u.pathname === '/poll') {                                        // hỏi-đáp một phát: trả NGAY giá trị hiện tại
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ n }) + '\n');
    return;
  }

  if (u.pathname === '/longpoll') {                                    // giữ kết nối tới khi có cái mới (hoặc 10s)
    const since = Number(u.searchParams.get('since') || 0);
    const send = (v) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(v) + '\n'); };
    if (n > since) return send({ n });
    const w = (v) => send(v);
    waiters.push(w);
    setTimeout(() => { const i = waiters.indexOf(w); if (i >= 0) { waiters.splice(i, 1); send({ n, timeout: true }); } }, 10000);
    return;
  }

  if (u.pathname === '/sse') {                                         // một kết nối, nhiều sự kiện — đẩy khi bộ đếm đổi
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
      'x-accel-buffering': 'no',                                       // bảo nginx ĐỪNG đệm (nếu không SSE kẹt sau proxy)
    });
    res.write('retry: 3000\n\n');                                      // trình duyệt tự nối lại sau 3s nếu rớt
    res.write(`data: {"n":${n}}\n\n`);                                 // trạng thái hiện tại ngay lập tức
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  res.writeHead(404); res.end('no\n');
}).listen(5100, '0.0.0.0', () => console.log('rt-srv on 0.0.0.0:5100'));
