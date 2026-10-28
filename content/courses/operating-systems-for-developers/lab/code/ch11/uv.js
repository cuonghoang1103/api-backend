// uv.js — hai kiểu chờ của libuv trong một chương trình: file đi THREAD POOL, socket đi EPOLL trên luồng chính.
const fs = require('fs');
const http = require('http');

const srv = http.createServer((req, res) => res.end('ok')).listen(3001, () => {
  fs.readFile('/etc/hostname', () => {                       // file: handed to a libuv worker thread
    http.get('http://127.0.0.1:3001/', (res) => {            // socket: non-blocking + epoll, main thread
      res.resume();
      res.on('end', () => srv.close());
    });
  });
});
