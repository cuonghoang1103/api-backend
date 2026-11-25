// Bài 8.3 — transaction trong Mongoose 9: connection.transaction() tự thử lại lỗi tạm thời và tự hủy khi callback ném lỗi.
// Bẫy: QUÊN truyền { session } cho một lệnh ⇒ lệnh đó chạy NGOÀI transaction, không bị hủy theo. Cách vá thứ hai: mongoose.set('transactionAsyncLocalStorage', true). Chạy: node s08-mg-tx.mjs
import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:47017/ch8?directConnection=true');
const Kho = mongoose.model('Kho', new mongoose.Schema({ _id: String, ton: { type: Number, min: 0 } }), 'kho');
const Don = mongoose.model('DonTx', new mongoose.Schema({ ma: String, sp: String, sl: Number }), 'donTx');
await Kho.createCollection(); await Don.createCollection();   // tạo collection TRƯỚC: trong transaction tạo ngầm dễ vướng lỗi

async function datHang(ma, sp, sl, { quenSession = false } = {}) {
  try {
    await mongoose.connection.transaction(async (session) => {
      await Don.create([{ ma, sp, sl }], quenSession ? {} : { session });           // create trong transaction phải là MẢNG
      const r = await Kho.updateOne({ _id: sp, ton: { $gte: sl } }, { $inc: { ton: -sl } }, { session });
      if (r.modifiedCount === 0) throw new Error(`hết hàng ${sp}`);                  // ném ⇒ transaction tự hủy
    });
    return 'đã đặt';
  } catch (e) { return `hủy (${e.message})`; }
}
for (const [quen, als] of [[false, false], [true, false], [true, true]]) {
  mongoose.set('transactionAsyncLocalStorage', als);   // Mongoose ≥ 8.4: tự gắn session cho mọi lệnh trong callback
  await Kho.deleteMany({}); await Don.deleteMany({});
  await Kho.create({ _id: 'SP017', ton: 3 });
  const kq = [];
  for (const [ma, sl] of [['D1', 2], ['D2', 2], ['D3', 1]]) kq.push(`${ma}×${sl}: ${await datHang(ma, 'SP017', sl, { quenSession: quen })}`);
  console.log(als ? 'QUÊN session + transactionAsyncLocalStorage:' : quen ? 'QUÊN session ở Don.create:' : 'Đủ session:', kq.join(' | '));
  console.log('   tồn kho', (await Kho.findById('SP017')).ton, '| đơn trong DB:', (await Don.find().lean()).map((d) => d.ma).join(', '));
}
await mongoose.disconnect();
