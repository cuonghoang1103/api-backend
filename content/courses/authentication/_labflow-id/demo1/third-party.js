// demo1/third-party.js — an analytics server on ANOTHER origin. It logs the Referer header it receives.
import http from 'node:http';
http.createServer((req, res) => {
  console.log(`[third-party] ${req.method} ${req.url}  Referer: ${req.headers.referer ?? '(none)'}`);
  res.setHeader('content-type', 'image/gif');
  res.end(Buffer.from('R0lGODlhAQABAAAAACw=', 'base64'));
}).listen(4801, () => console.log('demo1/third-party.js on http://127.0.0.1:4801'));
