// demo0/evil.js — an attacker's server on another origin: it only logs what it receives.
import http from 'node:http';
http.createServer((req, res) => {
  console.log(`[evil] ${req.method} ${req.url}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end('ok');
}).listen(4801, () => console.log('demo0/evil.js on http://127.0.0.1:4801'));
