// A tiny static server for dist/ — enough to see what a host does for you.
//   node server.mjs [--spa] [--port 4173]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const SPA = args.includes('--spa');
const PORT = Number(args[args.indexOf('--port') + 1]) || 4173;
const ROOT = path.resolve('dist');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.txt': 'text/plain', '.svg': 'image/svg+xml' };

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let file = path.join(ROOT, path.normalize(url.pathname));
  if (url.pathname.endsWith('/')) file = path.join(file, 'index.html');
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }

  if (!fs.existsSync(file)) {
    if (SPA && !path.extname(url.pathname)) file = path.join(ROOT, 'index.html');   // SPA fallback
    else { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('Not Found'); }
  }
  const isHashedAsset = url.pathname.startsWith('/assets/');
  res.writeHead(200, {
    'content-type': TYPES[path.extname(file)] || 'application/octet-stream',
    // hashed file names never change content ⇒ cache for a year; HTML must always be revalidated
    'cache-control': isHashedAsset ? 'public, max-age=31536000, immutable' : 'no-cache',
  });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`serving dist/ on http://localhost:${PORT}${SPA ? ' (SPA fallback on)' : ''}`));
