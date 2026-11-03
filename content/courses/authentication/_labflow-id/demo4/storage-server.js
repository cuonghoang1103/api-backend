// demo4/storage-server.js — lesson 4.5: one page of LabFlow's origin that keeps the SAME access token in three
// places, so an injected script can show what it can and cannot reach. Serves on http://localhost:4804.
import http from 'node:http';
const JWT = process.env.DEMO_JWT ?? 'eyJhbGciOiJFZERTQSJ9.demo.sig'; // a FAKE token passed in by the demo

http.createServer((req, res) => {
  if (req.url === '/') {
    res.setHeader('Set-Cookie', [
      `lfid_access_httponly=${JWT}; Path=/; HttpOnly; SameSite=Lax`, // the right way: JS cannot read it
      `lfid_access_readable=${JWT}; Path=/; SameSite=Lax`,           // the wrong way: a plain cookie
    ]);
    res.setHeader('content-type', 'text/html');
    // The app stores the token in localStorage so it can attach it as a Bearer header itself.
    return res.end(`<!doctype html><title>LabFlow</title><script>localStorage.setItem('lfid.access', ${JSON.stringify(JWT)})</script>ok`);
  }
  res.end('ok');
}).listen(4804, () => console.log('demo4/storage-server.js on http://localhost:4804'));
