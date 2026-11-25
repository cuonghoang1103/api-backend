// Bài 10.5 — change stream: nghe đơn mới / đơn đổi trạng thái của CT Shop theo thời gian thực, và NỐI LẠI sau khi tiến trình chết.
//   node theo-doi.mjs 8        (nghe 8 giây rồi thoát; resume token lưu ở /tmp/mgo-token.json sau MỖI sự kiện đã xử lý)
// Lần chạy sau đọc token cũ ⇒ nhận nốt các thay đổi xảy ra trong lúc tiến trình tắt (miễn oplog còn giữ chúng).
import { MongoClient } from 'mongodb';
import fs from 'node:fs';
const URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:47017/?directConnection=true';
const TOKEN = '/tmp/mgo-token.json';
const client = new MongoClient(URI, { appName: 'theo-doi-don' });
const orders = client.db('ctshop').collection('orders');

const token = fs.existsSync(TOKEN) ? JSON.parse(fs.readFileSync(TOKEN, 'utf8')) : null;
console.log(token ? 'nối lại từ resume token đã lưu' : 'bắt đầu nghe từ bây giờ');
const pipeline = [{ $match: { operationType: { $in: ['insert', 'update'] } } },
  { $project: { operationType: 1, 'documentKey._id': 1, 'fullDocument.status': 1, 'updateDescription.updatedFields': 1 } }];
const cs = orders.watch(pipeline, { resumeAfter: token ?? undefined });
setTimeout(async () => { await cs.close(); await client.close(); }, Number(process.argv[2] ?? 8) * 1000);
try {
  for await (const e of cs) {
    const chiTiet = e.operationType === 'insert' ? `status=${e.fullDocument.status}` : JSON.stringify(e.updateDescription.updatedFields);
    console.log(`  ${e.operationType.padEnd(6)} đơn ${e.documentKey._id}  ${chiTiet}`);
    fs.writeFileSync(TOKEN, JSON.stringify(e._id));   // lưu SAU khi xử lý xong ⇒ chết giữa chừng thì nhận lại sự kiện này (ít nhất một lần)
  }
} catch (e) { if (!cs.closed) throw e; }
