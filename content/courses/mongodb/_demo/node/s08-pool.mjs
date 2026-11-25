// Bài 8.1 — pool kết nối: 50 truy vấn CÙNG LÚC, mỗi truy vấn tốn ~200 ms ở máy chủ ($where + sleep, chỉ để mô phỏng truy vấn chậm).
// Đổi maxPoolSize và waitQueueTimeoutMS, đếm: tổng thời gian, số kết nối pool tạo, số lỗi; và phía máy chủ: số vé đọc (ticket)
// và số truy vấn phải xếp hàng chờ vé (serverStatus().queues.execution.read, MongoDB 8.0).
// Chạy: node s08-pool.mjs
import { MongoClient } from 'mongodb';

const URI = 'mongodb://127.0.0.1:47017/ctshop?directConnection=true';
const CHAM = { $where: 'sleep(200) || true' };          // khớp đúng 1 khách, nhưng máy chủ ngủ 200 ms

const admin = new MongoClient(URI);
const ve = async () => (await admin.db('admin').command({ serverStatus: 1 })).queues.execution.read;

async function thu(tuyChon) {
  const v0 = await ve();
  const c = new MongoClient(URI, tuyChon);
  const dem = { tao: 0 };
  c.on('connectionCreated', () => dem.tao++);
  const t = performance.now();
  const kq = await Promise.allSettled(Array.from({ length: 50 }, async (_, i) => {
    const b = performance.now();
    await c.db().collection('customers').findOne({ _id: `KH${String(i + 1).padStart(4, '0')}`, ...CHAM });
    return performance.now() - b;
  }));
  const ms = performance.now() - t;
  const ok = kq.filter((r) => r.status === 'fulfilled'), loi = kq.filter((r) => r.status === 'rejected');
  const lauNhat = Math.max(...ok.map((r) => r.value));
  console.log(`${JSON.stringify(tuyChon).padEnd(46)} xong ${String(ok.length).padStart(2)}/50 trong ${ms.toFixed(0).padStart(5)} ms,` +
    ` request chậm nhất ${lauNhat.toFixed(0).padStart(5)} ms, pool mở ${String(dem.tao).padStart(2)} kết nối` +
    (loi.length ? `, ${loi.length} lỗi ${loi[0].reason.name}: ${loi[0].reason.message}` : ''));
  const v1 = await ve();
  console.log(`${''.padEnd(46)} máy chủ: ${v1.totalTickets} vé đọc, ${v1.normalPriority.addedToQueue - v0.normalPriority.addedToQueue} truy vấn phải xếp hàng chờ vé`);
  await c.close();
}
await thu({ maxPoolSize: 5 });
await thu({ maxPoolSize: 10 });
await thu({ maxPoolSize: 50 });
await thu({ maxPoolSize: 5, waitQueueTimeoutMS: 1000 });
await admin.close();
