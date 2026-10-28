// naive.js — the same server with no signal handler (the default in most tutorials).
require('http').createServer((req, res) => res.end('ok\n')).listen(3000, () => console.log('listening, pid', process.pid));
