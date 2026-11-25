// Bài 9.3 — Mongoose sanitizeFilter: lưới an toàn thứ hai (KHÔNG thay việc kiểm kiểu ở cửa).
import mongoose from 'mongoose';
await mongoose.connect('mongodb://127.0.0.1:47017/ch9?directConnection=true');
const User = mongoose.model('User', new mongoose.Schema({ _id: Number, email: String, matKhau: String, vaiTro: String }), 'users_mg');
await User.deleteMany({});
await User.create({ _id: 1, email: 'admin@ctshop.vn', matKhau: 'Admin-Rat-Kho-Doan-2026', vaiTro: 'admin' });

const body = JSON.parse('{"email":"admin@ctshop.vn","matKhau":{"$ne":null}}');   // y như req.body kẻ xấu gửi
const thu = async (nhan) => {
  const q = User.findOne({ email: body.email, matKhau: body.matKhau });
  const kq = await q.then((u) => (u ? `ĐĂNG NHẬP ĐƯỢC (${u.vaiTro})` : 'null'), (e) => `${e.name}: ${e.message.split(' for model')[0]}`);
  console.log(nhan.padEnd(22), JSON.stringify(q.getFilter()));
  console.log(' '.repeat(22), '=>', kq);
};
await thu('mặc định');
mongoose.set('sanitizeFilter', true);
await thu('sanitizeFilter: true');
const u = await User.findOne({ _id: mongoose.trusted({ $gte: 1 }) });   // toán tử do CHÍNH mã mình viết ⇒ bọc trusted()
console.log('trusted({ $gte: 1 })'.padEnd(22), '=>', u?.email);
await mongoose.disconnect();
