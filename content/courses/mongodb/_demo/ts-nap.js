// Bài 10.5 — time series: 10 cảm biến nhiệt độ kho CT Shop, mỗi phút một số đo, 30 ngày = 432.000 số đo.
// Nạp CÙNG dữ liệu vào một time series collection và một collection thường để so dung lượng. TẤT ĐỊNH (LCG).
//   docker exec mgo-lab mongosh --quiet /demo/ts-nap.js
const d = db.getSiblingDB('ch10');
d.nhiet_ts.drop(); d.nhiet_thuong.drop();
d.createCollection('nhiet_ts', { timeseries: { timeField: 'luc', metaField: 'may', granularity: 'minutes' } });
let seed = 20261124;
const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const goc = Date.UTC(2026, 9, 1), PHUT = 60000, NGAY = 30, MAY = 10;
const t0 = Date.now();
for (let ngay = 0; ngay < NGAY; ngay++) {
  const lo = [];
  for (let p = 0; p < 1440; p++)
    for (let m = 1; m <= MAY; m++) {
      const gio = (p / 60) % 24;
      lo.push({ luc: new Date(goc + (ngay * 1440 + p) * PHUT), may: { id: 'KHO-' + m, khu: m <= 5 ? 'Hà Nội' : 'TP.HCM' },
        doC: Math.round((24 + 4 * Math.sin((gio - 8) / 24 * 2 * Math.PI) + (m > 5 ? 3 : 0) + rnd() * 1.5) * 10) / 10 });
    }
  d.nhiet_ts.insertMany(lo, { ordered: false });
  d.nhiet_thuong.insertMany(lo.map((x) => ({ ...x })), { ordered: false });
}
print(`nạp ${d.nhiet_ts.countDocuments()} số đo vào mỗi collection trong ${((Date.now() - t0) / 1000).toFixed(0)} s`);
