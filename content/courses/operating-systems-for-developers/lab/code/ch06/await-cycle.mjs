// await-cycle.mjs — vòng chờ giữa các Promise: "config" cần "secrets" để dựng, "secrets" lại cần "config".
// Mỗi thứ chỉ dựng MỘT lần (cache Promise — kiểu singleton/DI container). Không luồng nào, không khoá nào.
import { readFile } from 'node:fs/promises';
const deps = { config: ['secrets'], secrets: ['config'], logger: [] };
const cache = new Map();
function load(name) {
  if (!cache.has(name)) cache.set(name, build(name));
  return cache.get(name);
}
async function build(name) {
  await readFile(new URL(import.meta.url));             // đọc file cấu hình (I/O thật) trước khi dựng
  for (const d of deps[name]) await load(d);           // chờ phụ thuộc dựng xong
  console.log(`built ${name}`);
  return { name };
}
if (process.argv[2] === 'server') {                     // node await-cycle.mjs server: máy chủ đã chạy, vòng chờ nằm trong handler
  const http = await import('node:http');
  http.createServer(async (req, res) => {
    const cfg = await load('config');                   // yêu cầu nào cũng treo ở đây — không lỗi, không log
    res.end(`hello from ${cfg.name}\n`);
  }).listen(3000, () => console.log('listening on :3000'));
} else {
  console.log('starting app');
  await load('logger');
  await load('config');                                 // config → secrets → config: Promise tự chờ chính nó
  console.log('app listening on :3000');
}
