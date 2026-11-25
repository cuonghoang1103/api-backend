// Bài 8.3 — Mongoose khi chạy thật: discriminator, autoIndex/syncIndexes, E11000 ⇒ 409, optimisticConcurrency. Chạy: node s08-mg-prod.mjs
import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:47017/ch8?directConnection=true');
const coll = mongoose.connection.db.collection.bind(mongoose.connection.db);

// 1. Discriminator: nhiều "loại" thanh toán chung MỘT collection, phân biệt bằng trường kind
const ttSchema = new mongoose.Schema({ don: Number, soTien: Number }, { discriminatorKey: 'kind' });
const TT = mongoose.model('ThanhToan', ttSchema, 'thanhToan');
const The = TT.discriminator('the', new mongoose.Schema({ so4Cuoi: { type: String, required: true } }));
const Vi = TT.discriminator('vi', new mongoose.Schema({ nhaCungCap: { type: String, enum: ['momo', 'zalopay'] } }));
await TT.deleteMany({});
await The.create({ don: 1, soTien: 500000, so4Cuoi: '4242' });
await Vi.create({ don: 2, soTien: 120000, nhaCungCap: 'momo' });
console.log('1. trong DB:', JSON.stringify(await coll('thanhToan').find({}, { projection: { _id: 0, __v: 0 } }).toArray()));
console.log('   The.countDocuments() =', await The.countDocuments(), '| TT.countDocuments() =', await TT.countDocuments(),
  '| The.find().getFilter() =', JSON.stringify(The.find().getFilter()));

// 2. autoIndex và syncIndexes: Mongoose đồng bộ index THEO SCHEMA — index người khác tạo tay sẽ bị XOÁ
const kh = coll('khachMg');
await kh.drop().catch(() => {});
await kh.insertMany(Array.from({ length: 50000 }, (_, i) => ({ email: `u${i}@ex.com`, sdt: `09${String(i).padStart(8, '0')}`, city: ['HN', 'HCM', 'DN'][i % 3] })));
await kh.createIndex({ city: 1, sdt: 1 }, { name: 'dba_city_sdt' });     // DBA tạo tay để chữa một truy vấn chậm
const KhMg = mongoose.model('KhachMg', new mongoose.Schema({ email: { type: String, unique: true }, sdt: String, city: String }), 'khachMg');
const t = performance.now(); await KhMg.init();
console.log(`2. autoIndex khi model khởi tạo: tạo index email trên 50.000 tài liệu mất ${(performance.now() - t).toFixed(0)} ms; index:`, (await kh.indexes()).map((i) => i.name).join(', '));
console.log('   diffIndexes() =', JSON.stringify(await KhMg.diffIndexes()));
console.log('   syncIndexes() xoá:', JSON.stringify(await KhMg.syncIndexes()), '⇒ còn', (await kh.indexes()).map((i) => i.name).join(', '));

// 3. E11000 ⇒ HTTP 409 có nghĩa, thay vì 500
const thanh409 = (e) => e?.code === 11000 ? { status: 409, body: { loi: 'đã tồn tại', truong: Object.keys(e.keyValue)[0] } } : { status: 500 };
try { await KhMg.create({ email: 'u7@ex.com' }); } catch (e) { console.log('3. tạo email trùng ⇒', JSON.stringify(thanh409(e))); }

// 4. Hai người cùng sửa một hồ sơ: __v mặc định KHÔNG chặn; optimisticConcurrency thì chặn
for (const oc of [false, true]) {
  const HS = mongoose.model(`HoSo${oc ? 'OC' : ''}`, new mongoose.Schema({ ten: String, sdt: String, diaChi: String }, { optimisticConcurrency: oc }), 'hoSo');
  await HS.deleteMany({}); const { _id } = await HS.create({ ten: 'An', sdt: '0901', diaChi: 'Huế' });
  const a = await HS.findById(_id), b = await HS.findById(_id);       // hai tab cùng mở
  a.sdt = '0999'; await a.save();
  b.diaChi = 'Đà Nẵng';
  try { await b.save(); console.log(`4. optimisticConcurrency:${oc} ⇒ tab b lưu được, DB:`, JSON.stringify(await HS.findById(_id, '-_id ten sdt diaChi __v').lean())); }
  catch (e) { console.log(`   optimisticConcurrency:${oc} ⇒ tab b bị chặn: ${e.name} — ${e.message.split(' for model')[0].replace(/"[0-9a-f]{24}"/, '"<id>"')}`); }
}
await mongoose.disconnect();
