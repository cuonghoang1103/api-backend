// Bài 7.2 / lab 7.6 — ứng dụng ghi đơn LIÊN TỤC vào replica set, đo xem chuyển dự phòng làm ứng dụng thấy gì.
// Chạy trong mạng của cụm:  docker compose -p mgo-rs run --rm -e GIAY=30 app node ghi-lien-tuc.mjs
// Biến môi trường: URI (mặc định cụm rs1), GIAY (thời lượng, 30), NGHI (ms giữa hai lần ghi, 20), NHAN (tiền tố _id),
//   RETRY=0 để TẮT retryable writes, W=1 để ghi w:1 (mặc định majority).
// Mỗi đơn có _id riêng (NHAN-số) ⇒ cuối cùng đối chiếu: đơn nào được báo "đã ghi" mà không có trong DB (MẤT),
// đơn nào bị báo lỗi mà thật ra ĐÃ nằm trong DB (ứng dụng tưởng hỏng ⇒ dễ sinh bản trùng nếu thử lại bằng _id mới).
import { MongoClient } from 'mongodb';

const URI = process.env.URI ?? 'mongodb://r1:27017,r2:27017,r3:27017/ct7?replicaSet=rs1';
const GIAY = Number(process.env.GIAY ?? 30), NGHI = Number(process.env.NGHI ?? 20), NHAN = process.env.NHAN ?? 'G';
const retryWrites = process.env.RETRY !== '0';
const w = process.env.W === '1' ? 1 : 'majority';
const gio = () => new Date().toLocaleTimeString('vi-VN', { hour12: false, timeZone: 'Asia/Saigon' });
const t0 = Date.now(), s = () => `${gio()} ${((Date.now() - t0) / 1000).toFixed(1).padStart(5)}`;
const client = new MongoClient(URI, { retryWrites, writeConcern: { w } });
// Driver tự theo dõi cụm (hello mỗi ~10 s, nhanh hơn khi có lỗi) — in ra lúc nó thấy primary đổi.
let primary = null;
client.on('topologyDescriptionChanged', (ev) => {
  const p = [...ev.newDescription.servers.values()].find((sv) => sv.type === 'RSPrimary')?.address ?? 'KHÔNG CÓ';
  if (p !== primary) { if (primary !== null) console.log(`${s()}s driver thấy primary: ${p}`); primary = p; }
});
await client.connect();
const don = client.db().collection('don');
console.log(`${s()}s bắt đầu: retryWrites=${retryWrites} w=${w} trong ${GIAY}s`);

const ok = [], loi = [], dem = {};
let lanOkCuoi = Date.now(), lang = { ms: 0, tu: 0 }, chamNhat = 0, dangLoi = false, i = 0;
while (Date.now() - t0 < GIAY * 1000) {
  const id = `${NHAN}-${++i}`, b = Date.now();
  try {
    await don.insertOne({ _id: id, i, luc: new Date() });
    const xong = Date.now();
    ok.push(id); chamNhat = Math.max(chamNhat, xong - b);
    if (xong - lanOkCuoi > lang.ms) lang = { ms: xong - lanOkCuoi, tu: (lanOkCuoi - t0) / 1000 };
    if (dangLoi || xong - b > 1000) console.log(`${s()}s ghi được lại (lệnh này chờ ${xong - b} ms)`);
    lanOkCuoi = xong; dangLoi = false;
  } catch (e) {
    const ten = `${e.name}${e.codeName ? ' ' + e.codeName : ''}`;
    dem[ten] = (dem[ten] ?? 0) + 1; loi.push(id);
    if (!dangLoi) console.log(`${s()}s LỖI ${ten}: ${e.message.slice(0, 90)} (sau ${Date.now() - b} ms)`);
    dangLoi = true;
  }
  await new Promise((r) => setTimeout(r, NGHI));
}
console.log(`${s()}s hết giờ. Gửi ${i} đơn: báo thành công ${ok.length}, báo lỗi ${loi.length}`, JSON.stringify(dem));
console.log(`khoảng lâu nhất không ghi được: ${lang.ms} ms (từ giây ${lang.tu.toFixed(1)}); một lệnh chờ lâu nhất ${chamNhat} ms`);
// Đối chiếu với DB (đọc majority từ primary)
const coTrongDb = new Set((await don.find({ _id: { $in: [...ok, ...loi] } }, { projection: { _id: 1 } }).toArray()).map((d) => d._id));
const mat = ok.filter((id) => !coTrongDb.has(id)), loiMaCo = loi.filter((id) => coTrongDb.has(id));
console.log(`đối chiếu: báo thành công mà MẤT = ${mat.length}; báo lỗi mà thật ra ĐÃ GHI = ${loiMaCo.length}${loiMaCo.length ? ' (' + loiMaCo.slice(0, 5).join(', ') + ')' : ''}`);
await client.close();
