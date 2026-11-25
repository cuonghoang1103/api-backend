// Bài 8.2 — Mongoose 9: schema kiểm hợp lệ ở đâu, và ở đâu KHÔNG. Chạy: node s08-mg-schema.mjs
import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:47017/ch8?directConnection=true');
const spSchema = new mongoose.Schema({
  ma: { type: String, required: true, unique: true, match: /^SP\d{3}$/ },
  ten: { type: String, required: true, trim: true, maxlength: 60 },
  gia: { type: Number, required: true, min: 0 },
  loai: { type: String, enum: ['ao', 'quan', 'giay'] },
  email: { type: String, lowercase: true },
}, { timestamps: true });
let lanHook = 0;
spSchema.pre('save', function () { lanHook++; this.ten = this.ten.toUpperCase(); });   // chuẩn hoá tên khi save
const SP = mongoose.model('SanPham', spSchema, 'sanPham');
await SP.deleteMany({});
await SP.init();                                        // đợi index unique tạo xong (autoIndex)

// 1. create/save: kiểm hợp lệ + ép kiểu + middleware chạy
const a = await SP.create({ ma: 'SP101', ten: '  áo thun  ', gia: '199000', loai: 'ao', mau: 'đỏ' });
console.log('1. create:', JSON.stringify({ ma: a.ma, ten: a.ten, gia: a.gia, kieuGia: typeof a.gia, mau: a.mau, createdAt: !!a.createdAt }), '| hook save chạy', lanHook, 'lần');
try { await SP.create({ ma: 'X1', ten: 'Quần', gia: -5, loai: 'mu' }); }
catch (e) { console.log('   create sai ⇒', e.name, '—', Object.keys(e.errors).map((k) => `${k}: ${e.errors[k].kind}`).join(', ')); }

// 2. updateOne/findOneAndUpdate: KHÔNG chạy validator (mặc định) và KHÔNG chạy hook save
await SP.updateOne({ ma: 'SP101' }, { gia: -5, loai: 'mu', ten: 'áo khoác' });
const sau = await SP.findOne({ ma: 'SP101' }).lean();
console.log('2. updateOne lọt:', JSON.stringify({ gia: sau.gia, loai: sau.loai, ten: sau.ten }), '| hook save vẫn', lanHook, 'lần');
try { await SP.updateOne({ ma: 'SP101' }, { gia: -5 }, { runValidators: true }); }
catch (e) { console.log('   có runValidators:true ⇒', e.name, '—', Object.keys(e.errors).join(', ')); }

// 3. trường ngoài schema: strict (ghi) bỏ im lặng; strictQuery (đọc/xoá) mặc định false ⇒ GIỮ NGUYÊN bộ lọc
const x = await SP.create({ ma: 'SP102', ten: 'giày', gia: 500000, loai: 'giay', giamGia: 0.2 });
console.log('3. ghi trường lạ giamGia:', (await SP.collection.findOne({ ma: 'SP102' })).giamGia);
console.log('   SP.countDocuments({ loia: "ao" }) (gõ sai tên trường) =', await SP.countDocuments({ loia: 'ao' }));
mongoose.set('strictQuery', true);
console.log('   strictQuery:true ⇒ countDocuments({ loia: "ao" }) =', await SP.countDocuments({ loia: 'ao' }), '(bộ lọc bị BỎ ⇒ đếm tất cả)');
mongoose.set('strictQuery', 'throw');
try { await SP.deleteMany({ loia: 'ao' }); } catch (e) { console.log("   strictQuery:'throw' ⇒ deleteMany({ loia }) ném", e.name + ':', e.message); }
console.log('   còn', await SP.countDocuments(), 'sản phẩm');
mongoose.set('strictQuery', false);

// 4. unique KHÔNG phải validator: là index — lỗi đến từ máy chủ (E11000), không phải ValidationError
try { await SP.create({ ma: 'SP102', ten: 'giày 2', gia: 1 }); } catch (e) { console.log('4. trùng mã ⇒', e.name, 'code', e.code, JSON.stringify(e.keyValue)); }
await mongoose.disconnect();
