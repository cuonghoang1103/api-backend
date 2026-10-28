// server.js — a tiny HTTP server that handles SIGTERM the way a container wants (lesson 12.7).
const http = require('http');
const s = http.createServer((req, res) => res.end('ok\n')).listen(3000, () => console.log('listening, pid', process.pid));
process.on('SIGTERM', () => {
  console.log('SIGTERM: stop accepting, finish in-flight requests, exit');
  s.close(() => process.exit(0));
});
