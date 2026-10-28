// checkout.js — dịch vụ "thanh toán" nhỏ cho câu chuyện tinh chỉnh bài 15.8. Mỗi request: một chút việc CPU (kiểm tra
// giỏ hàng) + ghi MỘT dòng nhật ký kiểm toán phải BỀN (không được mất khi máy sập) rồi mới trả lời.
//   LOG=sync  node checkout.js   ⇒ appendFileSync + fsyncSync cho TỪNG request (bản gốc: chặn event loop mỗi lần)
//   LOG=async node checkout.js   ⇒ fs.promises appendFile + sync cho từng request (đẩy sang thread pool libuv)
//   LOG=group node checkout.js   ⇒ gom các dòng đang chờ, MỘT write + MỘT fdatasync cho cả nhóm, rồi trả lời cả nhóm
// Cả ba đều chỉ trả lời SAU khi dòng nhật ký đã fsync xong ⇒ cùng một lời hứa về độ bền.
const http = require('node:http');
const fs = require('node:fs');
const MODE = process.env.LOG || 'sync';
const FILE = process.env.AUDIT || '/var/tmp/audit.log';
const fd = fs.openSync(FILE, 'a');
const fh = fs.promises.open(FILE, 'a');
let fsyncs = 0, served = 0;

function validateCart(id) {                    // ~0,2 ms việc CPU giả: băm giỏ hàng
  let h = id >>> 0;
  for (let i = 0; i < 40000; i++) h = (h * 31 + i) >>> 0;
  return h;
}
const line = (id, h) => `${new Date().toISOString()} order=${id} cart=${h.toString(16)} status=PAID\n`;

let queue = [], flushing = false;
async function flush() {                       // group commit: một lần ghi + một lần fdatasync cho mọi dòng đang chờ
  if (flushing || !queue.length) return;
  flushing = true;
  const batch = queue; queue = [];
  const f = await fh;
  await f.appendFile(batch.map((b) => b.text).join(''));
  await f.datasync(); fsyncs++;
  for (const b of batch) b.done();
  flushing = false;
  if (queue.length) flush();
}

let next = 1;
http.createServer(async (req, res) => {
  if (req.url === '/stats') return res.end(JSON.stringify({ mode: MODE, served, fsyncs }) + '\n');
  const id = next++;
  const text = line(id, validateCart(id));
  if (MODE === 'sync') { fs.appendFileSync(fd, text); fs.fsyncSync(fd); fsyncs++; }
  else if (MODE === 'async') { const f = await fh; await f.appendFile(text); await f.sync(); fsyncs++; }
  else await new Promise((done) => { queue.push({ text, done }); flush(); });
  served++;
  res.end(`{"order":${id},"status":"PAID"}\n`);
}).listen(+(process.argv[2] || 8080), () => console.log(`checkout.js pid ${process.pid} LOG=${MODE} UV_THREADPOOL_SIZE=${process.env.UV_THREADPOOL_SIZE || 4}`));
