// ro-ri.js — API có "bộ nhớ đệm" tự viết KHÔNG BAO GIỜ xoá: mỗi request với một id mới cất 200 KB vào Map ⇒ RSS chỉ tăng.
// Đây là kiểu rò rỉ bộ nhớ phổ biến nhất ở backend: không phải "quên free", mà là giữ tham chiếu mãi.
const http = require('http');
const cache = new Map();                                    // ❌ không giới hạn kích thước, không TTL
http.createServer((req, res) => {
  const id = new URL(req.url, 'http://x').searchParams.get('id');
  if (!cache.has(id)) cache.set(id, Buffer.alloc(200 * 1024, 1));
  res.end(`cached=${cache.size}\n`);
}).listen(3001, () => console.log(`ro-ri on :3001 pid=${process.pid}`));
