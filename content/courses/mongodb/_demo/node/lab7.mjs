// Lab 7.6 — BỘ CHẠY + ĐỐI CHIẾU (phát sẵn, KHÔNG sửa): "sống sót khi mất một máy mà không mất đơn nào".
// Ứng dụng đặt đơn liên tục vào replica set rs1; trong lúc chạy, rs/hon-loan.sh cắt primary khỏi hai máy kia (split-brain) hoặc giết nó.
//   docker compose -p mgo-rs run --rm -e CHE_DO=ngay-tho app node lab7.mjs   # dùng lab7-ngay-tho.mjs (bản "cho nhanh" hay gặp)
//   docker compose -p mgo-rs run --rm -e CHE_DO=cua-ban  app node lab7.mjs   # dùng lab7-cua-ban.mjs — bài làm của bạn
// Biến: GIAY (thời lượng đặt đơn, 40), CHO (giây chờ cụm lành lại rồi mới đối chiếu, 45), NHAN (tiền tố mã đơn).
// Đối chiếu cuối: (1) đơn đã báo khách "thành công" mà không còn trong DB = MẤT; (2) một mã đơn có >1 tài liệu = TRÙNG
//                 (khách bị trừ tiền hai lần); (3) đơn báo khách "thất bại" mà thật ra đã nằm trong DB = BÁO SAI.
import { MongoClient } from 'mongodb';

const CHE_DO = process.env.CHE_DO ?? 'giai';
const GIAY = Number(process.env.GIAY ?? 40), CHO = Number(process.env.CHO ?? 45), NHAN = process.env.NHAN ?? CHE_DO;
const impl = await import(`./lab7-${CHE_DO}.mjs`);   // tệp cài đặt: xuất URI (chuỗi kết nối) và datDon(don, maDon, log) ⇒ true/false
const URI = impl.URI;
const client = new MongoClient(URI);
await client.connect();
const don = client.db().collection('don7');
await don.createIndex({ maDon: 1 });   // CỐ Ý không unique ở bản ngây thơ để thấy được trùng; bản giải dùng _id = maDon (luôn duy nhất)
const gio = () => new Date().toLocaleTimeString('vi-VN', { hour12: false, timeZone: 'Asia/Saigon' });
const t0 = Date.now(), s = () => `${gio()} ${((Date.now() - t0) / 1000).toFixed(1).padStart(5)}s`;
const ngu = (ms) => new Promise((r) => setTimeout(r, ms));
console.log(`${s()} CHE_DO=${CHE_DO}: đặt đơn trong ${GIAY}s`);

const baoOk = [], baoLoi = [];
let lanLoi = 0;
const log = (e, them = '') => { lanLoi++; if (lanLoi === 1) console.log(`${s()} lỗi đầu: ${e.name} ${e.message.slice(0, 70)}${them}`); };

let i = 0;
while (Date.now() - t0 < GIAY * 1000) {
  const maDon = `${NHAN}-${String(++i).padStart(5, '0')}`, b = Date.now();
  const ok = await impl.datDon(don, maDon, log);
  (ok ? baoOk : baoLoi).push(maDon);
  if (Date.now() - b > 2000) console.log(`${s()} đơn ${maDon} chờ ${Date.now() - b} ms rồi ${ok ? 'thành công' : 'THẤT BẠI'}`);
  await ngu(20);
}
console.log(`${s()} hết giờ: ${i} đơn — báo khách thành công ${baoOk.length}, thất bại ${baoLoi.length}; số lần gặp lỗi ${lanLoi}`);
console.log(`${s()} chờ ${CHO}s cho cụm lành (bầu lại, rollback xong) rồi đối chiếu bằng đọc majority...`);
await ngu(CHO * 1000);
const dem = new Map();
for await (const d of don.find({ maDon: { $regex: `^${NHAN}-` } }, { projection: { maDon: 1 }, readConcern: { level: 'majority' } })) {
  dem.set(d.maDon, (dem.get(d.maDon) ?? 0) + 1);
}
const mat = baoOk.filter((m) => !dem.has(m));
const trung = [...dem].filter(([, n]) => n > 1).map(([m]) => m);
const baoSai = baoLoi.filter((m) => dem.has(m));
console.log(`${s()} ĐỐI CHIẾU: MẤT ${mat.length}${mat.length ? ' (' + mat.slice(0, 3).join(', ') + '…)' : ''} · TRÙNG ${trung.length}${trung.length ? ' (' + trung.slice(0, 3).join(', ') + ')' : ''} · BÁO SAI ${baoSai.length}`);
console.log(mat.length + trung.length + baoSai.length === 0 ? 'ĐẠT: không mất, không trùng, không báo sai.' : 'KHÔNG ĐẠT.');
await client.close();
