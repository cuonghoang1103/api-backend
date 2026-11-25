// Bài 8.3 — bufferCommands: khi CHƯA kết nối được, Mongoose không báo lỗi ngay mà GIỮ lệnh lại chờ (mặc định 10 s).
// Mô phỏng: trỏ tới cổng không có MongoDB (47099). Chạy: node s08-mg-dem.mjs
import mongoose from 'mongoose';

for (const bufferCommands of [true, false]) {
  const conn = mongoose.createConnection('mongodb://127.0.0.1:47099/ch8?directConnection=true', { bufferCommands, serverSelectionTimeoutMS: 30000 });
  conn.asPromise().catch(() => {});
  const M = conn.model('X', new mongoose.Schema({ a: Number }));
  const t = performance.now();
  try { await M.find(); } catch (e) { console.log(`bufferCommands:${bufferCommands} ⇒ request chờ ${((performance.now() - t) / 1000).toFixed(1)} s rồi: ${e.name} — ${e.message}`); }
  await conn.close(true);
}
