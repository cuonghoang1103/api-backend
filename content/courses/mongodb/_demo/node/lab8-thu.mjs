// Lab 8.5 — MỘT bộ kiểm cho HAI bản API (Express + Mongoose, Spring Boot). Bộ kiểm tự nạp lại dữ liệu lab8 bằng driver rồi gọi HTTP.
// Chạy: node lab8-thu.mjs http://127.0.0.1:47081      (bản Express)     node lab8-thu.mjs http://127.0.0.1:47082   (bản Spring)
import { MongoClient, Decimal128 } from 'mongodb';

const BASE = process.argv[2] ?? 'http://127.0.0.1:47081';
const client = new MongoClient('mongodb://127.0.0.1:47017/lab8?directConnection=true');
const db = client.db();
await db.dropDatabase();
await db.collection('sp').insertMany([
  { _id: 'SP001', ten: 'Áo thun', gia: Decimal128.fromString('33333.33'), ton: 10 },
  { _id: 'SP002', ten: 'Tất', gia: Decimal128.fromString('0.10'), ton: 1000 },
  { _id: 'SP003', ten: 'Mũ', gia: Decimal128.fromString('0.20'), ton: 1000 },
]);
await db.collection('khach').insertOne({ _id: 'KH1', ten: 'An', sdt: '0901', v: 0 });
await db.createCollection('don');

const goi = async (method, path, body) => {
  const r = await fetch(BASE + path, { method, headers: { 'content-type': 'application/json' }, body: body && JSON.stringify(body) });
  let j = null; try { j = await r.json(); } catch {}
  return { s: r.status, j };
};
let dat = 0, tong = 0;
const kiem = (ten, dung, chiTiet = '') => { tong++; if (dung) dat++; console.log(`${dung ? '✔' : '✘'} ${ten}${dung ? '' : '  ← ' + chiTiet}`); };

let r = await goi('GET', '/sp/SP001');
kiem('GET /sp/SP001 ⇒ 200, giá là CHUỖI "33333.33"', r.s === 200 && r.j?.gia === '33333.33', JSON.stringify(r));
r = await goi('GET', '/sp/SP999');
kiem('GET /sp/SP999 ⇒ 404', r.s === 404, r.s);
r = await goi('POST', '/don', { khach: 'KH1', items: [{ sp: 'SP002', sl: 1 }, { sp: 'SP003', sl: 1 }] });
kiem('POST /don 0.10 + 0.20 ⇒ 201, tong đúng "0.30" (không phải 0.30000000000000004)', r.s === 201 && r.j?.tong === '0.30', JSON.stringify(r));
const idDon = r.j?.id;
r = await goi('GET', `/don/${idDon}`);
kiem('GET /don/:id vừa tạo ⇒ 200, có 2 dòng hàng', r.s === 200 && r.j?.items?.length === 2, JSON.stringify(r));
r = await goi('GET', '/don/abc');
kiem('GET /don/abc ⇒ 400 (id không hợp lệ, không phải 500)', r.s === 400, r.s);
r = await goi('GET', '/don/6b04fe3c9cb91bd7dced2467');
kiem('GET /don/<ObjectId không tồn tại> ⇒ 404', r.s === 404, r.s);
for (const [ten, body] of [['items rỗng', { khach: 'KH1', items: [] }], ['sl = 0', { khach: 'KH1', items: [{ sp: 'SP002', sl: 0 }] }],
  ['sl là chuỗi "2"', { khach: 'KH1', items: [{ sp: 'SP002', sl: '2' }] }], ['sl là toán tử {"$gt":0}', { khach: 'KH1', items: [{ sp: 'SP002', sl: { $gt: 0 } }] }]]) {
  r = await goi('POST', '/don', body);
  kiem(`POST /don ${ten} ⇒ 400`, r.s === 400, `${r.s} ${JSON.stringify(r.j)}`);
}
r = await goi('POST', '/don', { khach: 'KH1', items: [{ sp: 'SP002', sl: 5 }, { sp: 'SP001', sl: 11 }] });
const tonSP002 = (await db.collection('sp').findOne({ _id: 'SP002' })).ton;
kiem('POST /don thiếu hàng SP001 ⇒ 409 và KHÔNG trừ SP002 (transaction hủy cả đơn)', r.s === 409 && tonSP002 === 999, `${r.s} ton SP002 = ${tonSP002}`);
r = await goi('PATCH', '/khach/KH1', { sdt: '0911', v: 0 });
const r2 = await goi('PATCH', '/khach/KH1', { sdt: '0922', v: 0 });
kiem('PATCH /khach/KH1 hai lần cùng v=0 ⇒ 200 rồi 409', r.s === 200 && r2.s === 409, `${r.s} ${r2.s}`);

// 40 khách cùng mua 1 SP001 (tồn 10) một lúc
const kq = await Promise.all(Array.from({ length: 40 }, () => goi('POST', '/don', { khach: 'KH1', items: [{ sp: 'SP001', sl: 1 }] })));
const n201 = kq.filter((x) => x.s === 201).length, n409 = kq.filter((x) => x.s === 409).length;
const ton = (await db.collection('sp').findOne({ _id: 'SP001' })).ton;
const soDon = await db.collection('don').countDocuments({ 'items.sp': 'SP001' });
kiem(`40 đơn đồng thời trên tồn 10 ⇒ đúng 10×201, 30×409, tồn 0, 10 đơn (đo: ${n201}/${n409}/${ton}/${soDon})`, n201 === 10 && n409 === 30 && ton === 0 && soDon === 10, kq.filter((x) => ![201, 409].includes(x.s)).map((x) => x.s).join(','));
const d3 = await db.collection('don').findOne({ 'items.sp': 'SP001' });
kiem('tong lưu trong MongoDB là Decimal128 (không phải chuỗi/double)', d3?.tong?._bsontype === 'Decimal128', `${typeof d3?.tong} ${d3?.tong?._bsontype}`);
console.log(`ĐIỂM: ${dat}/${tong}`);
await client.close();
