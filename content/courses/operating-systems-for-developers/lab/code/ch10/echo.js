// echo.js — máy chủ echo Node: một luồng JS, libuv lo epoll. s.pipe(s) = đọc gì ghi nấy, CÓ backpressure.
const net = require('node:net');
net.createServer((s) => s.pipe(s))
  .listen({ port: +process.argv[2], backlog: 4096 }, () => console.log('echo-node: libuv', process.versions.uv));
