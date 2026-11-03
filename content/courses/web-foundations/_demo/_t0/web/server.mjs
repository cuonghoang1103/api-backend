// chay: tay — a whole web server in 13 lines (Node.js, no libraries). Run: node server.mjs
import http from 'node:http';

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);                      // every request that arrives
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Hello from my server</h1>');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found: ' + req.url);
  }
});
server.listen(3000, () => console.log('listening on http://localhost:3000'));
