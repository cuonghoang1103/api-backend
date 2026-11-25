// Bài 10.3 — dữ liệu LỚN HƠN bộ nhớ đệm: 600.000 tài liệu × ~1,5 KB chữ khó nén ⇒ ~0,9 GB khi giải nén, trong khi cache chỉ 0,25 GB.
// Chạy trong container riêng mgo-tai (--wiredTigerCacheSizeGB 0.25): mongosh --quiet /demo/ws-nap.js   (~1–2 phút). TẤT ĐỊNH (LCG).
const c = db.getSiblingDB('ch10').kho;
c.drop();
let seed = 20261124;
const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const CHU = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
// Sinh 1 MiB chữ ngẫu nhiên MỘT lần, mỗi tài liệu cắt một đoạn ở vị trí ngẫu nhiên (nhanh hơn sinh từng ký tự ~1000 lần, vẫn khó nén).
let R = ''; for (let j = 0; j < 1 << 20; j++) R += CHU[(rnd() * 64) | 0];
const N = 600000, LO = 5000, t0 = Date.now();
for (let lo = 0; lo < N / LO; lo++) {
  const docs = [];
  for (let k = 1; k <= LO; k++) {
    const o = (rnd() * (R.length - 1500)) | 0;
    docs.push({ _id: lo * LO + k, ghiChu: R.slice(o, o + 1500) });
  }
  c.insertMany(docs, { ordered: false });
}
const st = c.stats();
print(`ch10.kho: ${st.count} tài liệu, dữ liệu ${(st.size / 2 ** 20).toFixed(0)} MiB (giải nén), trên đĩa ${(st.storageSize / 2 ** 20).toFixed(0)} MiB, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
