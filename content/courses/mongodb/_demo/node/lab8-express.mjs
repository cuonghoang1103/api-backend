// Lab 8.5 — LỜI GIẢI bản Express 5 + Mongoose 9. Chạy: node lab8-express.mjs   (cổng 47081, database lab8)
import express from 'express';
import mongoose from 'mongoose';

mongoose.set('transactionAsyncLocalStorage', true);          // mọi lệnh trong connection.transaction() tự mang session
mongoose.set('strictQuery', 'throw');
const { Decimal128 } = mongoose.Types;
const SP = mongoose.model('SP', new mongoose.Schema({ _id: String, ten: String, gia: Decimal128, ton: Number }), 'sp');
const Khach = mongoose.model('Khach', new mongoose.Schema({ _id: String, ten: String, sdt: String, v: Number }), 'khach');
const Don = mongoose.model('Don', new mongoose.Schema({
  khach: String, items: [{ _id: false, sp: String, sl: Number, gia: Decimal128 }], tong: Decimal128, taoLuc: Date,
}), 'don');

class LoiHttp extends Error { constructor(status, body) { super(body.loi); this.status = status; this.body = body; } }
const nguyenDuong = (x) => Number.isInteger(x) && x > 0 && x <= 1000;           // typeof === 'number' ⇒ chặn cả "2" lẫn {"$gt":0}

// Cộng tiền bằng số nguyên "xu" (2 chữ số thập phân) — không bao giờ dùng double cho tiền
const xu = (d) => { const [a, b = ''] = d.toString().split('.'); return BigInt(a + (b + '00').slice(0, 2)); };
const raTien = (n) => { const s = n.toString().padStart(3, '0'); return `${s.slice(0, -2)}.${s.slice(-2)}`; };

const app = express();
app.use(express.json({ limit: '20kb' }));
app.get('/sp/:ma', async (req, res) => {
  const s = await SP.findById(String(req.params.ma)).lean();
  if (!s) throw new LoiHttp(404, { loi: 'khong-co' });
  res.json({ ma: s._id, ten: s.ten, gia: s.gia.toString(), ton: s.ton });
});
app.post('/don', async (req, res) => {
  const { khach, items } = req.body ?? {};
  if (typeof khach !== 'string' || !Array.isArray(items) || items.length === 0 || items.length > 20
      || !items.every((i) => typeof i?.sp === 'string' && nguyenDuong(i.sl))) throw new LoiHttp(400, { loi: 'du-lieu-sai' });
  const don = await mongoose.connection.transaction(async () => {
    const dong = []; let tong = 0n;
    for (const { sp, sl } of items) {
      const s = await SP.findOneAndUpdate({ _id: sp, ton: { $gte: sl } }, { $inc: { ton: -sl } }, { returnDocument: 'after', projection: { gia: 1 } }).lean();
      if (!s) throw new LoiHttp(409, { loi: 'het-hang', sp });       // ném ⇒ transaction hủy ⇒ các dòng trước được hoàn kho
      dong.push({ sp, sl, gia: s.gia }); tong += xu(s.gia) * BigInt(sl);
    }
    const [d] = await Don.create([{ khach, items: dong, tong: Decimal128.fromString(raTien(tong)), taoLuc: new Date() }]);
    return d;
  });
  res.status(201).json({ id: don._id, tong: don.tong.toString() });
});
app.get('/don/:id', async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) throw new LoiHttp(400, { loi: 'id-sai' });
  const d = await Don.findById(req.params.id).lean();
  if (!d) throw new LoiHttp(404, { loi: 'khong-co' });
  res.json({ id: d._id, khach: d.khach, tong: d.tong.toString(), items: d.items.map((i) => ({ ...i, gia: i.gia.toString() })) });
});
app.patch('/khach/:id', async (req, res) => {
  const { sdt, v } = req.body ?? {};
  if (typeof sdt !== 'string' || !Number.isInteger(v)) throw new LoiHttp(400, { loi: 'du-lieu-sai' });
  const r = await Khach.updateOne({ _id: String(req.params.id), v }, { $set: { sdt }, $inc: { v: 1 } });
  if (r.matchedCount === 0) throw new LoiHttp(409, { loi: 'da-bi-sua' });
  res.json({ v: v + 1 });
});
app.use((err, req, res, next) => {                              // Express 5: lỗi trong hàm async tự tới đây
  if (err instanceof LoiHttp) return res.status(err.status).json(err.body);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ loi: 'json-sai' });
  console.error(err); res.status(500).json({ loi: 'loi-may-chu' });
});

await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:47017/lab8?directConnection=true', { maxPoolSize: 20 });
const server = app.listen(47081, '127.0.0.1', () => console.log('lab8 Express nghe 127.0.0.1:47081'));
process.on('SIGTERM', () => server.close(() => mongoose.disconnect().then(() => process.exit(0))));
