// Bài 8.1 — cùng một lab, hai chuỗi kết nối. Lab là replica set MỘT thành viên tự xưng "localhost:27017" (compose.yaml),
// còn máy bạn thấy nó ở 127.0.0.1:47017. Chạy: node s08-ket-noi.mjs
import { MongoClient } from 'mongodb';

for (const uri of ['mongodb://127.0.0.1:47017/ctshop', 'mongodb://127.0.0.1:47017/ctshop?directConnection=true']) {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });
  const t = Date.now();
  try {
    const n = await client.db().collection('orders').countDocuments();
    console.log(`${uri}\n  ✔ ${n} đơn sau ${Date.now() - t} ms`);
  } catch (e) {
    console.log(`${uri}\n  ✘ ${e.name} sau ${Date.now() - t} ms: ${e.message.split('\n')[0].slice(0, 90)}`);
    const sv = [...e.reason?.servers?.values() ?? []].map((s) => `${s.address} (${s.type})`);
    console.log(`  driver đã thấy: ${sv.join(', ')}`);
  } finally { await client.close(); }
}
