// Lab 8.5 — bản NGÂY THƠ (đừng làm theo): tiền bằng Number, không transaction, không kiểm kiểu, findById thẳng chuỗi lạ.
import express from 'express';
import mongoose from 'mongoose';

const SP = mongoose.model('SP', new mongoose.Schema({ _id: String, ten: String, gia: Number, ton: Number }), 'sp');
const Khach = mongoose.model('Khach', new mongoose.Schema({ _id: String, ten: String, sdt: String, v: Number }), 'khach');
const Don = mongoose.model('Don', new mongoose.Schema({ khach: String, items: Array, tong: Number }), 'don');
const app = express();
app.use(express.json());
app.get('/sp/:ma', async (req, res) => {
  const s = await SP.findById(req.params.ma);
  s ? res.json({ ma: s._id, ten: s.ten, gia: s.gia, ton: s.ton }) : res.status(404).end();
});
app.post('/don', async (req, res) => {
  let tong = 0;
  for (const i of req.body.items) {
    const s = await SP.findById(i.sp);
    if (s.ton < i.sl) return res.status(409).json({ loi: 'het-hang' });   // đọc rồi mới trừ ⇒ tranh chấp
    s.ton -= i.sl; await s.save();
    tong += s.gia * i.sl;
  }
  const d = await Don.create({ khach: req.body.khach, items: req.body.items, tong });
  res.status(201).json({ id: d._id, tong: String(tong) });
});
app.get('/don/:id', async (req, res) => {
  const d = await Don.findById(req.params.id);
  d ? res.json(d) : res.status(404).end();
});
app.patch('/khach/:id', async (req, res) => {
  await Khach.updateOne({ _id: req.params.id }, { sdt: req.body.sdt });
  res.json({ ok: true });
});
await mongoose.connect('mongodb://127.0.0.1:47017/lab8?directConnection=true');
app.listen(47081, '127.0.0.1', () => console.log('lab8 ngây thơ nghe 127.0.0.1:47081'));
