// Bài 6.1 — khoá lạc quan đi tới tận client: API PUT /gio/:id nhận lại v mà client đã đọc; lệch ⇒ HTTP 409.
// Hai "tab" cùng tải giỏ (v = 0) rồi cùng gửi lưu: một tab thắng, tab kia nhận 409 và phải tải lại.
// Chạy: node gio-409.mjs   (máy chủ thử nghe 127.0.0.1:47099, tự tắt khi xong)
import http from 'node:http';
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:47017/?directConnection=true');
const gio = client.db('ch6').collection('gioApi');
await gio.deleteMany({});
await gio.insertOne({ _id: 'G1', v: 0, items: [], tong: 0 });
const tinhTong = (items) => items.reduce((s, x) => s + x.gia * x.sl, 0);

const server = http.createServer(async (req, res) => {
  const id = req.url.split('/')[2];
  let body = ''; for await (const c of req) body += c;
  const { v, items } = JSON.parse(body);                       // client gửi lại v nó đã đọc
  const r = await gio.updateOne({ _id: id, v }, { $set: { items, tong: tinhTong(items) }, $inc: { v: 1 } });
  res.setHeader('content-type', 'application/json; charset=utf-8');
  if (r.matchedCount === 0) { res.statusCode = 409; return res.end(JSON.stringify({ loi: 'Giỏ đã đổi ở nơi khác, tải lại rồi thử lại' })); }
  res.end(JSON.stringify({ v: v + 1 }));
});
await new Promise((ok) => server.listen(47099, '127.0.0.1', ok));

const luu = (tab, items) => fetch('http://127.0.0.1:47099/gio/G1', { method: 'PUT', body: JSON.stringify({ v: 0, items }) })
  .then(async (r) => console.log(tab, '→', r.status, await r.text()));
await Promise.all([
  luu('tab điện thoại', [{ sp: 'SP017', gia: 150000, sl: 1 }]),
  luu('tab laptop    ', [{ sp: 'SP040', gia: 90000, sl: 2 }]),
]);
console.log('trong DB:', JSON.stringify(await gio.findOne({ _id: 'G1' })));
server.close();
await client.close();
