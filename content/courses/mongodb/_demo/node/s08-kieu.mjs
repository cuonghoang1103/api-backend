// Bài 8.1 — kiểu BSON đi qua ranh giới JavaScript: ObjectId dạng chuỗi, Decimal128, số nguyên 64 bit, Date.
// Chạy: node s08-kieu.mjs
import { MongoClient, ObjectId, Decimal128, Long } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:47017/?directConnection=true');
const bl = client.db('ch8').collection('binhLuan');
await bl.deleteMany({});
const { insertedId } = await bl.insertOne({ noiDung: 'Áo đẹp', luotXem: Long.fromNumber(42), luotThich: Long.fromString('9007199254740993'), gia: Decimal128.fromString('199000.50') });

// 1. Express đưa id trên URL dưới dạng CHUỖI: /binh-luan/:id
const idTuUrl = insertedId.toHexString();
console.log('1. findOne({ _id: chuỗi })          →', await bl.findOne({ _id: idTuUrl }));
console.log('   findOne({ _id: new ObjectId(chuỗi) }) →', (await bl.findOne({ _id: new ObjectId(idTuUrl) }))?.noiDung);
console.log('   ObjectId.isValid("abc"), isValid("123456789012") →', ObjectId.isValid('abc'), ObjectId.isValid('123456789012'));
try { new ObjectId('khong-hop-le'); } catch (e) { console.log('   new ObjectId("khong-hop-le") ném', e.name + ':', e.message.slice(0, 60)); }

// 2. Decimal128 không phải number của JavaScript
const d = await bl.findOne({ _id: insertedId });
console.log('2. typeof gia =', typeof d.gia, '| gia + 1 =', d.gia + 1, '| JSON:', JSON.stringify({ gia: d.gia }));
console.log('   Number(gia.toString()) * 3 =', Number(d.gia.toString()) * 3, '| nhân ở máy chủ:',
  (await bl.aggregate([{ $project: { _id: 0, x3: { $multiply: ['$gia', 3] } } }]).next()).x3.toString());

// 3. Số nguyên 64 bit: driver đổi Long thành number khi giá trị còn chính xác; vượt 2^53 thì trả Long (không tự làm tròn)
console.log('3. luotXem (Long 42, mặc định) =', d.luotXem, typeof d.luotXem, '| luotThich (2^53+1) =', d.luotThich, typeof d.luotThich);
const d2 = await bl.findOne({ _id: insertedId }, { promoteLongs: false });
console.log('   promoteLongs:false ⇒ luotXem =', d2.luotXem.toString(), d2.luotXem.constructor.name, '| JSON.stringify(luotThich) =', JSON.stringify(d.luotThich));

// 4. Date: lưu UTC, in theo múi giờ của máy chạy Node
const t = new Date('2026-11-24T23:30:00+07:00');
await bl.updateOne({ _id: insertedId }, { $set: { luc: t } });
const d3 = await bl.findOne({ _id: insertedId });
console.log('4. lưu', t.toISOString(), '| toString() trên máy TZ=' + (process.env.TZ ?? '(mặc định)') + ':', d3.luc.toString().slice(0, 33));
await client.close();
