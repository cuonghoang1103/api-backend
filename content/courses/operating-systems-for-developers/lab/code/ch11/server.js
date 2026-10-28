// server.js — máy chủ "hello" tối giản của Node (giống mọi API Express ở tầng syscall).
require('http').createServer((req, res) => res.end('hello\n')).listen(3000);
