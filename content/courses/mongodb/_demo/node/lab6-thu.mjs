// Lab 6.5 — BỘ BẮN ĐỒNG THỜI + KIỂM BẤT BIẾN (phát sẵn, KHÔNG sửa). Chạy: node lab6-thu.mjs ./<tệp-cài-đặt>.mjs
// Tệp cài đặt xuất: chuanBi(db) (tuỳ chọn), chuyenTien(ctx, { maGD, tu, den, tien }), datHang(ctx, { maDon, khach, mon: [{ sp, sl }] })
//   ctx = { client, db }. Mỗi hàm trả 'ok' | 'thieu-tien' | 'het-hang' | 'trung' (đã xử lý rồi). Ném lỗi = 'loi'.
// Dữ liệu: 20 ví V00…V19 mỗi ví 1.000.000 đ + ví SHOP 0 đ; 5 sản phẩm K1…K5 mỗi mã tồn 20, giá 100.000 đ.
// Tải: 200 lệnh chuyển + 100 đơn (LCG cố định ⇒ ai chạy cũng cùng bộ lệnh), ~20% bị GỬI LẠI cùng mã (giả lập khách bấm hai lần / client thử lại).
import { MongoClient } from 'mongodb';

const impl = await import(new URL(process.argv[2] ?? './lab6-giai.mjs', import.meta.url));
const client = new MongoClient('mongodb://127.0.0.1:47017/?directConnection=true');
const db = client.db('lab6');
await db.dropDatabase();
const VI = Array.from({ length: 20 }, (_, i) => 'V' + String(i).padStart(2, '0'));
await db.collection('vi').insertMany([...VI.map((_id) => ({ _id, du: 1000000 })), { _id: 'SHOP', du: 0 }]);
await db.collection('kho').insertMany(['K1', 'K2', 'K3', 'K4', 'K5'].map((_id) => ({ _id, ton: 20, gia: 100000 })));
if (impl.chuanBi) await impl.chuanBi(db);

let x = 20261124;
const r = (n) => { x = (x * 1103515245 + 12345) % 2147483648; return (x >>> 8) % n; }; // lấy bit cao: bit thấp của LCG lặp chu kỳ ngắn
const lenh = [];
for (let i = 0; i < 200; i++) {
  const tu = VI[r(20)]; let den = VI[r(20)]; if (den === tu) den = 'V' + String((+tu.slice(1) + 1) % 20).padStart(2, '0');
  const l = { loai: 'chuyen', maGD: 'GD' + i, tu, den, tien: (r(8) + 1) * 50000 };
  lenh.push(l); if (r(5) === 0) lenh.push({ ...l });
}
for (let i = 0; i < 100; i++) {
  const mon = Array.from({ length: r(3) + 1 }, () => ({ sp: 'K' + (r(5) + 1), sl: r(3) + 1 }));
  const l = { loai: 'don', maDon: 'DH' + i, khach: VI[r(20)], mon };
  lenh.push(l); if (r(5) === 0) lenh.push({ ...l, mon: mon.map((m) => ({ ...m })) });
}
for (let i = lenh.length - 1; i > 0; i--) { const j = r(i + 1); [lenh[i], lenh[j]] = [lenh[j], lenh[i]]; }

const ctx = { client, db };
const t0 = Date.now();
const kq = await Promise.all(lenh.map((l) => (l.loai === 'chuyen' ? impl.chuyenTien(ctx, l) : impl.datHang(ctx, l)).catch((e) => 'loi: ' + e.message)));
const dem = {}; for (const k of kq) { const t = k.startsWith('loi') ? 'loi' : k; dem[t] = (dem[t] ?? 0) + 1; }
console.log(`${lenh.length} yêu cầu đồng thời trong ${Date.now() - t0} ms:`, JSON.stringify(dem));
if (impl.thongKe) console.log('  hàm trong transaction đã chạy', impl.thongKe.lanChay, 'lần (gồm các lần withTransaction tự thử lại)');
const loiDau = kq.find((k) => k.startsWith('loi')); if (loiDau) console.log('  lỗi đầu tiên:', loiDau.slice(0, 120));

// ── Kiểm bất biến ──
const vi = await db.collection('vi').find().toArray();
const kho = await db.collection('kho').find().toArray();
const tong = vi.reduce((s, v) => s + v.du, 0);
const mgdOk = new Set(lenh.filter((l, i) => l.loai === 'chuyen' && kq[i] === 'ok').map((l) => l.maGD));
const mdOk = new Set(lenh.filter((l, i) => l.loai === 'don' && kq[i] === 'ok').map((l) => l.maDon));
const soOkChuyen = lenh.filter((l, i) => l.loai === 'chuyen' && kq[i] === 'ok').length;
const soOkDon = lenh.filter((l, i) => l.loai === 'don' && kq[i] === 'ok').length;
// Dựng lại số dư + tồn kho chỉ từ các yêu cầu được báo 'ok' — phải khớp DB.
const duKyVong = Object.fromEntries([...VI.map((v) => [v, 1000000]), ['SHOP', 0]]);
const tonKyVong = { K1: 20, K2: 20, K3: 20, K4: 20, K5: 20 };
const daTinh = new Set();
lenh.forEach((l, i) => {
  if (kq[i] !== 'ok') return;
  const ma = l.maGD ?? l.maDon; if (daTinh.has(ma)) return; daTinh.add(ma);
  if (l.loai === 'chuyen') { duKyVong[l.tu] -= l.tien; duKyVong[l.den] += l.tien; }
  else { const tien = l.mon.reduce((s, m) => s + m.sl * 100000, 0); duKyVong[l.khach] -= tien; duKyVong.SHOP += tien; for (const m of l.mon) tonKyVong[m.sp] -= m.sl; }
});
const kiem = [
  ['tổng tiền giữ nguyên 20.000.000', tong === 20000000, `tổng = ${tong}`],
  ['không ví nào âm', vi.every((v) => v.du >= 0), vi.filter((v) => v.du < 0).map((v) => `${v._id}=${v.du}`).join(' ') || 'ok'],
  ['không mã hàng nào âm', kho.every((k) => k.ton >= 0), kho.map((k) => `${k._id}=${k.ton}`).join(' ')],
  ['mỗi mã GD/mã đơn được báo ok đúng MỘT lần', soOkChuyen === mgdOk.size && soOkDon === mdOk.size, `chuyển ok ${soOkChuyen} lần / ${mgdOk.size} mã, đơn ok ${soOkDon} lần / ${mdOk.size} mã`],
  ['DB khớp đúng các yêu cầu báo ok', vi.every((v) => v.du === duKyVong[v._id]) && kho.every((k) => k.ton === tonKyVong[k._id]),
    `lệch ví: ${vi.filter((v) => v.du !== duKyVong[v._id]).length}, lệch kho: ${kho.filter((k) => k.ton !== tonKyVong[k._id]).length}`],
];
for (const [ten, dat, chiTiet] of kiem) console.log(dat ? '✅' : '❌', ten.padEnd(44), chiTiet);
console.log(`ĐẠT ${kiem.filter((k) => k[1]).length}/${kiem.length} bất biến`);
await client.close();
