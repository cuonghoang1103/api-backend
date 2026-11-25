// Bài 8.1 — con trỏ (cursor): toArray() kéo HẾT vào RAM, for await đọc theo lô. Đo heap Node và đếm lệnh find/getMore
// mà driver thật sự gửi (commandStarted). Dữ liệu: 200.000 dòng nhật ký ~600 byte trong ch8.nhatKy (tạo nếu chưa có).
// Chạy: node --expose-gc s08-con-tro.mjs
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:47017/?directConnection=true', { monitorCommands: true });
const nk = client.db('ch8').collection('nhatKy');
if ((await nk.estimatedDocumentCount()) !== 200000) {
  await nk.drop().catch(() => {});
  for (let lo = 0; lo < 20; lo++)
    await nk.insertMany(Array.from({ length: 10000 }, (_, i) => ({ _id: lo * 10000 + i, muc: i % 7 ? 'INFO' : 'WARN', noiDung: 'x'.repeat(560) })));
}
const lenh = [];
client.on('commandStarted', (e) => { if (e.commandName === 'find' || e.commandName === 'getMore') lenh.push(e.commandName); });
let lo = 0;
client.on('commandSucceeded', (e) => { if (e.commandName === 'getMore' || e.commandName === 'find') lo = Math.max(lo, (e.reply.cursor.firstBatch ?? e.reply.cursor.nextBatch).length); });
const MB = (b) => (b / 1048576).toFixed(0).padStart(4) + ' MB';

async function do_(ten, f) {
  global.gc(); lenh.length = 0; lo = 0;
  const h0 = process.memoryUsage().heapUsed; let dinh = h0;
  const theo = setInterval(() => { dinh = Math.max(dinh, process.memoryUsage().heapUsed); }, 5);
  const t = performance.now(); const n = await f(); const ms = performance.now() - t;
  clearInterval(theo); dinh = Math.max(dinh, process.memoryUsage().heapUsed);
  const g = lenh.filter((x) => x === 'getMore').length;
  console.log(`${ten.padEnd(34)} ${n} dòng, ${ms.toFixed(0).padStart(5)} ms, heap tăng tới ${MB(dinh - h0)}, gửi ${lenh.length - g} find + ${g} getMore (lô lớn nhất ${lo})`);
}
await do_('toArray()', async () => (await nk.find({}).toArray()).length);
await do_('for await (mặc định)', async () => { let n = 0; for await (const d of nk.find({})) n++; return n; });
await do_('for await, batchSize 1000', async () => { let n = 0; for await (const d of nk.find({}, { batchSize: 1000 })) n++; return n; });
await do_('for await + projection {muc:1}', async () => { let n = 0; for await (const d of nk.find({}, { projection: { muc: 1 } })) n++; return n; });
await client.close();
