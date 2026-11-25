// Bài 8.2 + 8.3 — đọc bằng Mongoose: lean, populate, N+1, $lookup. Đếm lệnh driver thật sự gửi (monitorCommands) và đo thời gian.
// Dữ liệu: CT Shop (2.000 đơn, 200 khách). Mỗi cách chạy 5 lần, lấy trung vị. Chạy: node s08-mg-doc.mjs
import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:47017/ctshop?directConnection=true', { monitorCommands: true });
const dem = {};
mongoose.connection.getClient().on('commandStarted', (e) => { dem[e.commandName] = (dem[e.commandName] ?? 0) + 1; });
const Khach = mongoose.model('Khach', new mongoose.Schema({ _id: String, name: String, email: String, city: String }), 'customers');
const Don = mongoose.model('Don', new mongoose.Schema({
  _id: Number, customerId: { type: String, ref: 'Khach' }, status: String,
  items: [{ productId: String, name: String, price: mongoose.Types.Decimal128, qty: Number }],
  total: mongoose.Types.Decimal128, createdAt: Date,
}), 'orders');

async function do_(ten, f) {
  const ms = [];
  let mau, lenh;
  for (let i = 0; i < 5; i++) {
    for (const k in dem) delete dem[k];
    const t = performance.now(); mau = await f(); ms.push(performance.now() - t);
    lenh = Object.entries(dem).filter(([k]) => !['hello', 'endSessions'].includes(k)).map(([k, v]) => `${v} ${k}`).join(' + ');
  }
  ms.sort((a, b) => a - b);
  console.log(`${ten.padEnd(36)} ${String(mau.n).padStart(4)} đơn, trung vị ${ms[2].toFixed(1).padStart(6)} ms, gửi ${lenh}`);
  return mau;
}

await do_('find() — tài liệu Mongoose đầy đủ', async () => ({ n: (await Don.find()).length }));
await do_('find().lean() — object JS thường', async () => ({ n: (await Don.find().lean()).length }));
const p = await do_('populate("customerId")', async () => { const r = await Don.find().populate('customerId', 'name city').lean(); return { n: r.length, mot: r[0] }; });
await do_('N+1: vòng lặp findById từng khách', async () => {
  const r = await Don.find().lean();
  for (const d of r) d.khach = await Khach.findById(d.customerId, 'name city').lean();
  return { n: r.length };
});
const l = await do_('$lookup trong aggregate', async () => {
  const r = await Don.aggregate([{ $lookup: { from: 'customers', localField: 'customerId', foreignField: '_id', as: 'khach',
    pipeline: [{ $project: { name: 1, city: 1 } }] } }, { $set: { khach: { $first: '$khach' } } }]);
  return { n: r.length, mot: r[0] };
});
console.log('populate đơn 1 ⇒ customerId =', JSON.stringify(p.mot.customerId));
console.log('$lookup  đơn 1 ⇒ khach      =', JSON.stringify(l.mot.khach));

await mongoose.disconnect();
