// serve.mjs — phục vụ cùng một trang ở hai origin: :5173 (trang của LabFlow) và :5174 (trang lạ)
import http from 'node:http';
import { readFileSync } from 'node:fs';
const page = readFileSync(new URL('./index.html', import.meta.url));
for (const port of [5173, 5174]) http.createServer((req, res) => res.writeHead(200, { 'Content-Type': 'text/html' }).end(page)).listen(port);
