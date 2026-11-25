// Bài 7.4–7.5 — sinh đơn hàng TẤT ĐỊNH cho cụm shard (chạy trong mongosh nối mongos: load('/demo/shard/don-shard.js')).
//   napDon('don_hash', 200000)            ⇒ nạp 200.000 đơn theo lô 10.000, ordered:false; trả số ms
//   phanBo('don_hash')                    ⇒ "sh1=… sh2=…" số tài liệu mỗi shard đang sở hữu
//   loDon(n, batDau)                      ⇒ mảng n đơn (để tự thử ordered:true/false)
// Đơn: khachId 1..5000 (một số khách mua nhiều hơn hẳn), ngay tăng dần từ 01/01/2026 mỗi phút một đơn, vung HN/HCM/DN, tong (đồng).
const GOC_NGAY = new Date('2026-01-01T00:00:00+07:00').getTime();
const VUNG = ['HN', 'HCM', 'HCM', 'DN', 'HN', 'HCM'];   // HCM nhiều nhất
function loDon(n, batDau = 0) {
  let x = 20261124 + batDau;
  const r = () => (x = (x * 48271) % 2147483647) / 2147483647;
  return Array.from({ length: n }, (_, i) => {
    const k = batDau + i;
    const khachId = r() < 0.2 ? 1 + Math.floor(r() * 50) : 1 + Math.floor(r() * 5000);   // 20% đơn của 50 khách sỉ
    return { khachId, ngay: new Date(GOC_NGAY + k * 60000), vung: VUNG[Math.floor(r() * VUNG.length)],
             tong: 1000 * (10 + Math.floor(r() * 990)), ghiChu: 'x'.repeat(100) };
  });
}
function napDon(ten, n, ordered = false, batDau = 0) {
  const t = Date.now();
  for (let b = 0; b < n; b += 10000) db.getCollection(ten).insertMany(loDon(Math.min(10000, n - b), batDau + b), { ordered });
  return Date.now() - t;
}
function phanBo(ten) {
  const d = db.getSiblingDB('admin').aggregate([{ $shardedDataDistribution: {} }, { $match: { ns: db.getName() + '.' + ten } }]).toArray()[0];
  if (!d) return '(chưa shard)';
  return d.shards.map((s) => `${s.shardName}=${s.numOwnedDocuments}`).sort().join(' ');
}
