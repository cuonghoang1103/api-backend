// Bài 10.4 — công cụ đo tải MongoDB TỰ VIẾT (~100 dòng), đo p50/p95/p99 đúng cách.
//   node tai.mjs --viec khach --toc 500 --giay 10                 # mô hình MỞ: 500 yêu cầu/giây đều đặn, bất kể máy chủ nhanh hay chậm
//   node tai.mjs --viec khach --bac 250,500,1000,2000 --giay 8     # tăng dần tải, mỗi bậc một dòng ⇒ tìm điểm gãy
//   node tai.mjs --viec khach --dong 8 --giay 10                    # mô hình ĐÓNG: 8 "người dùng", xong yêu cầu này mới gửi yêu cầu kia
// Mặc định đọc ch4.don (1.000.000 đơn của Bài 4.1, _demo/don-trieu.js); --db/--coll đổi nơi đọc.
// Việc (--viec): khach = 10 đơn mới nhất của một khách (có index) · id = đọc một đơn theo _id · ghi = chèn một đơn · tong = $group cả collection.
// Độ trễ ở mô hình mở tính từ lúc yêu cầu LẼ RA được gửi (theo lịch), không phải lúc nó thật sự rời máy ⇒ không dính "coordinated omission".
// Cột "trễ-ngây-thơ" tính từ lúc thật sự gửi — để thấy hai cách đo lệch nhau thế nào khi máy chủ quá tải.
import { MongoClient } from 'mongodb';

const thamSo = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') ? [...a, [x.slice(2), all[i + 1]]] : a), []));
const URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:47017/?directConnection=true';
const DB = thamSo.db ?? 'ch4', COLL = thamSo.coll ?? 'don', VUNG = Number(thamSo.vung ?? 1), VIEC = thamSo.viec ?? 'khach', GIAY = Number(thamSo.giay ?? 10);
const POOL = Number(thamSo.pool ?? 50), NONG = Number(thamSo.nong ?? 2);

const client = new MongoClient(URI, { maxPoolSize: POOL, appName: 'tai-mjs' });
await client.connect();
const don = client.db(DB).collection(COLL);
const soDon = await don.estimatedDocumentCount();

let hat = 20261124;                                           // ngẫu nhiên tất định ⇒ hai lần chạy hỏi cùng những khách
const rnd = () => { hat = (Math.imul(hat, 1664525) + 1013904223) >>> 0; return hat / 4294967296; };
let idMoi = 10_000_000;
const VIECS = {
  khach: () => don.find({ khach: 'KH' + String(1 + Math.floor(rnd() * 50000)).padStart(5, '0') }).sort({ ngay: -1 }).limit(10).toArray(),
  id: () => don.findOne({ _id: 1 + Math.floor(rnd() * soDon * VUNG) }),        // --vung 0.05 ⇒ chỉ hỏi 5% đơn đầu (dữ liệu "nóng")
  ghi: () => don.insertOne({ _id: idMoi++, khach: 'KH00001', tong: 199000, ngay: new Date(), trangThai: 'NEW' }),
  tong: () => don.aggregate([{ $group: { _id: '$trangThai', n: { $sum: 1 } } }]).toArray(),
};
const lam = VIECS[VIEC];
if (!lam) throw new Error('--viec phải là ' + Object.keys(VIECS).join(' | '));

const phanVi = (a, p) => a.length ? a[Math.min(a.length - 1, Math.floor(a.length * p))] : NaN;
const ms = (x) => (x < 10 ? x.toFixed(2) : x < 100 ? x.toFixed(1) : x.toFixed(0)).padStart(6);

function inDong(nhan, tre, treNgay, loi, giayThat) {
  tre.sort((a, b) => a - b); treNgay?.sort((a, b) => a - b);
  const tl = Math.round(tre.length / giayThat);
  console.log(`${nhan.padEnd(14)} xong ${String(tre.length).padStart(6)} lỗi ${String(loi).padStart(4)} | thông lượng ${String(tl).padStart(5)}/s | ` +
    `p50 ${ms(phanVi(tre, 0.5))} p95 ${ms(phanVi(tre, 0.95))} p99 ${ms(phanVi(tre, 0.99))} max ${ms(tre.at(-1) ?? NaN)} ms` +
    (treNgay ? ` | trễ-ngây-thơ p99 ${ms(phanVi(treNgay, 0.99))}` : ''));
}

// Mô hình MỞ: yêu cầu thứ i được lên lịch ở t0 + i/toc. Bộ hẹn giờ trễ thì bắn bù ngay — không "chờ máy chủ rảnh".
async function moHinhMo(toc, giay) {
  const tre = [], treNgay = [], dangBay = new Set(); let loi = 0;
  const t0 = performance.now(), tong = Math.round(toc * giay);
  for (let i = 0; i < tong;) {
    const bayGio = performance.now();
    while (i < tong && t0 + (i * 1000) / toc <= bayGio) {
      const dinh = t0 + (i * 1000) / toc, gui = performance.now();
      const p = lam().then(() => { const x = performance.now(); tre.push(x - dinh); treNgay.push(x - gui); }, () => { loi++; })
        .finally(() => dangBay.delete(p));
      dangBay.add(p); i++;
    }
    await new Promise((r) => setTimeout(r, 1));
  }
  await Promise.all(dangBay);
  return { tre, treNgay, loi, giayThat: (performance.now() - t0) / 1000 };
}

// Mô hình ĐÓNG: n vòng lặp, mỗi vòng chờ xong mới gửi tiếp. Máy chủ chậm ⇒ công cụ tự gửi ÍT đi ⇒ số đo đẹp giả.
async function moHinhDong(n, giay) {
  const tre = []; let loi = 0; const t0 = performance.now(), het = t0 + giay * 1000;
  await Promise.all(Array.from({ length: n }, async () => {
    while (performance.now() < het) {
      const a = performance.now();
      try { await lam(); tre.push(performance.now() - a); } catch { loi++; }
    }
  }));
  return { tre, treNgay: null, loi, giayThat: (performance.now() - t0) / 1000 };
}

await moHinhDong(8, NONG);                                    // làm nóng: mở sẵn kết nối, nạp index vào cache — số của giây đầu không tính
if (thamSo.dong) {
  const r = await moHinhDong(Number(thamSo.dong), GIAY);
  inDong(thamSo.nhan ?? `đóng ${thamSo.dong} luồng`, r.tre, r.treNgay, r.loi, r.giayThat);
} else {
  for (const toc of (thamSo.bac ?? thamSo.toc ?? '500').split(',').map(Number)) {
    const r = await moHinhMo(toc, GIAY);
    inDong(thamSo.nhan ?? `mở ${toc}/s`, r.tre, r.treNgay, r.loi, r.giayThat);
  }
}
await client.close();
