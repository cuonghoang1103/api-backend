// server-nohandler.js — y hệt nhưng KHÔNG bắt SIGTERM
require('http').createServer((q, r) => r.end('hi\n')).listen(8080, () => console.log(`pid ${process.pid} listening`));
