// Đề thi thực hành Bài 11.2 (CT Cinema) — nạp dữ liệu TẤT ĐỊNH vào database "pe11".
// Chạy: docker exec mgo-lab mongosh --quiet /demo/pe11/nap.js     (xoá sạch pe11 rồi nạp lại — chạy lại ra đúng dữ liệu cũ)
// Giờ trong dữ liệu là giờ Việt Nam (UTC+7) lúc SINH, lưu thành Date (UTC) như mọi ứng dụng làm.
const d = db.getSiblingDB('pe11');
d.dropDatabase();
let seed = 20261125;
const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = (a) => a[Math.floor(rnd() * a.length)];
// gioVN(2026, 12, 5, 0, 30) = 00:30 ngày 05/12/2026 giờ Việt Nam = 2026-12-04T17:30:00Z
const gioVN = (y, m, dd, h, mi) => new Date(Date.UTC(y, m - 1, dd, h - 7, mi));

const rap = [
  { _id: 'R1', ten: 'CT Cinema Cầu Giấy', thanhPho: 'Hà Nội' },
  { _id: 'R2', ten: 'CT Cinema Long Biên', thanhPho: 'Hà Nội' },
  { _id: 'R3', ten: 'CT Cinema Hà Đông', thanhPho: 'Hà Nội' },
  { _id: 'R4', ten: 'CT Cinema Quận 1', thanhPho: 'TP.HCM' },
  { _id: 'R5', ten: 'CT Cinema Thủ Đức', thanhPho: 'TP.HCM' },
  { _id: 'R6', ten: 'CT Cinema Hải Châu', thanhPho: 'Đà Nẵng' },
];
d.rap.insertMany(rap);

const TL = ['Hành động', 'Khoa học viễn tưởng', 'Hài', 'Tình cảm', 'Kinh dị', 'Hoạt hình', 'Tài liệu'];
const phim = [];
for (let i = 1; i <= 40; i++) {
  const n = int(1, 3), tl = [];
  while (tl.length < n) { const t = pick(TL); if (!tl.includes(t)) tl.push(t); }
  phim.push({ _id: 'P' + String(i).padStart(3, '0'), ten: 'Phim số ' + i, theLoai: tl, thoiLuong: int(85, 170),
    phatHanh: gioVN(int(2025, 2026), int(1, 12), int(1, 28), 0, 0), diemImdb: int(45, 92) / 10 });
}
// Vài phim cố định để đề có chỗ "bẫy" rõ ràng (thứ tự thể loại khác nhau, trùng điểm).
phim[6].theLoai = ['Khoa học viễn tưởng', 'Hành động']; phim[6].diemImdb = 8.1;
phim[11].theLoai = ['Hành động', 'Khoa học viễn tưởng']; phim[11].diemImdb = 8.1;
phim[19].theLoai = ['Hành động', 'Khoa học viễn tưởng', 'Hài']; phim[19].diemImdb = 7.4;
d.phim.insertMany(phim);

const khach = [];
for (let i = 1; i <= 300; i++) khach.push({ _id: 'K' + String(i).padStart(4, '0'), email: `k${i}@example.com`, thanhPho: pick(['Hà Nội', 'TP.HCM', 'Đà Nẵng']) });
d.khach.insertMany(khach);

const HANG = 'ABCDEFGH';
const gheMoi = () => { const g = []; for (const h of HANG) for (let c = 1; c <= 10; c++) g.push({ ma: h + c, loai: 'GH'.includes(h) ? 'VIP' : 'THUONG', trangThai: 'TRONG' }); return g; };
const suat = [];
for (let i = 1; i <= 600; i++) {
  const ngay = int(0, 60), khuya = rnd() < 0.12;
  const goc = new Date(Date.UTC(2026, 10, 1 + ngay));
  const bd = khuya ? gioVN(goc.getUTCFullYear(), goc.getUTCMonth() + 1, goc.getUTCDate(), 0, pick([0, 30, 60]))
                   : gioVN(goc.getUTCFullYear(), goc.getUTCMonth() + 1, goc.getUTCDate(), int(9, 22), pick([0, 15, 30, 45]));
  suat.push({ _id: 'S' + String(i).padStart(4, '0'), phimId: 'P' + String(int(1, 40)).padStart(3, '0'), rapId: pick(rap)._id,
    batDau: bd, giaVe: NumberDecimal(String(pick([75000, 90000, 110000]))), ghe: gheMoi() });
}
// Suất khuya đầu tháng 12: theo giờ Việt Nam thuộc tháng 12, theo UTC lại rơi vào 30/11.
Object.assign(suat[0], { phimId: 'P007', rapId: 'R1', batDau: gioVN(2026, 12, 1, 0, 30) });
Object.assign(suat[1], { phimId: 'P012', rapId: 'R2', batDau: gioVN(2026, 12, 5, 0, 15) });
Object.assign(suat[2], { phimId: 'P007', rapId: 'R2', batDau: gioVN(2026, 12, 6, 0, 45) });

const ve = [];
const coc = Date.UTC(2026, 9, 20);
for (let i = 1; i <= 3000; i++) {
  const s = pick(suat), n = int(1, 4), batDauCot = int(0, 9);
  const hang = pick(HANG.split('')), ds = [];
  for (let k = 0; k < n; k++) ds.push(hang + (batDauCot + 1 + k));
  const gs = s.ghe.filter((g) => ds.includes(g.ma));
  if (gs.some((g) => g.trangThai !== 'TRONG')) continue;           // ghế đã có người — bỏ lượt này
  const kh = i % 100 === 0 ? 'K0042' : pick(khach)._id;
  const huy = rnd() < 0.1;
  if (!huy) for (const g of gs) { g.trangThai = 'DAT'; g.datBoi = kh; }
  const gia = Number(s.giaVe.toString());
  const tong = gs.reduce((a, g) => a + gia + (g.loai === 'VIP' ? 20000 : 0), 0);
  // giờ mua làm tròn tới GIỜ ⇒ nhiều vé trùng taoLuc (bẫy phân trang)
  const mua = Math.min(s.batDau.getTime() - 3600e3, coc + int(0, 50 * 24) * 3600e3);
  ve.push({ _id: new ObjectId(Math.floor(mua / 1000).toString(16).padStart(8, '0') + String(i).padStart(16, '0')),
    khachId: kh, suatId: s._id, rapId: s.rapId, phimId: s.phimId, ghe: ds, tong: NumberDecimal(String(tong)),
    trangThai: huy ? 'HUY' : 'DA_THANH_TOAN', taoLuc: new Date(Math.floor(mua / 3600e3) * 3600e3) });
}
// K0042 mua 6 vé cùng một giờ (đặt hộ bạn bè) — trùng taoLuc.
for (const v of ve.filter((x) => x.khachId === 'K0042').slice(0, 6)) v.taoLuc = new Date(Date.UTC(2026, 10, 3, 5));
d.suat.insertMany(suat);
d.ve.insertMany(ve);
print(`pe11: ${d.rap.countDocuments()} rạp · ${d.phim.countDocuments()} phim · ${d.khach.countDocuments()} khách · ${d.suat.countDocuments()} suất · ${d.ve.countDocuments()} vé (${d.ve.countDocuments({ trangThai: 'HUY' })} huỷ)`);
