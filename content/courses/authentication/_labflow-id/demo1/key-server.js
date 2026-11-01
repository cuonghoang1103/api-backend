// demo1/key-server.js — lesson 1.3: an endpoint that checks an API key with ===, the way most first versions do.
import http from 'node:http';
const API_KEY = process.env.DEMO_API_KEY; // a FAKE 64-character key, passed in by the demo
http.createServer((req, res) => {
  const ok = req.headers['x-api-key'] === API_KEY;
  res.statusCode = ok ? 200 : 401;
  res.end(ok ? 'ok' : 'no');
}).listen(4802, () => console.log('demo1/key-server.js on http://127.0.0.1:4802'));
