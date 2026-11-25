// Bài 10.2 — "khám sức khoẻ" một máy MongoDB trong 1 giây: đọc serverStatus + replSetGetStatus, so với ngưỡng, in OK / CẢNH BÁO.
//   docker exec mgo-lab mongosh --quiet /demo/suc-khoe.js         (cần vai trò clusterMonitor nếu bật --auth)
// Ngưỡng dưới đây là điểm khởi đầu hợp lý cho máy nhỏ — chỉnh theo số đo bình thường của hệ thống bạn (đường nền).
const s = db.serverStatus();
const c = s.wiredTiger.cache;
let canh = 0;
const dong = (ten, giaTri, xau, ghiChu = '') => { if (xau) canh++; print(`${xau ? 'CẢNH BÁO' : 'ok      '}  ${ten.padEnd(31)} ${String(giaTri).padEnd(22)} ${ghiChu}`); };

const kn = s.connections;
dong('kết nối đang mở', `${kn.current} / ${kn.current + kn.available}`, kn.current / (kn.current + kn.available) > 0.8, `(đã tạo từ lúc chạy: ${kn.totalCreated})`);
const dungCache = c['bytes currently in the cache'] / c['maximum bytes configured'];
const ban = c['tracked dirty bytes in the cache'] / c['maximum bytes configured'];
dong('cache đang dùng', (dungCache * 100).toFixed(1) + ' %', dungCache > 0.95, '(> 95 % kéo dài ⇒ luồng ứng dụng phải tự dọn cache)');
dong('cache bẩn (chưa ghi đĩa)', (ban * 100).toFixed(1) + ' %', ban > 0.2, '(> 20 % ⇒ ghi bị chặn chờ)');
const ev = c['application thread time evicting (usecs)'];   // tên chỉ số của 8.0 — bản khác có thể đổi tên, kiểm undefined
dong('luồng ứng dụng phải tự dọn', ev === undefined ? 'không có chỉ số' : (ev / 1e6).toFixed(1) + ' s', ev === undefined || ev > 1e6, '(> 1 s và tăng ⇒ cache quá nhỏ cho tải)');
const q = s.queues?.execution ?? {};
const hang = (q.read?.out ?? 0) + (q.write?.out ?? 0), ve = (q.read?.totalTickets ?? 0) + (q.write?.totalTickets ?? 0);
dong('vé thực thi đang dùng', `${hang} / ${ve}`, ve && hang / ve > 0.9, '(hết vé ⇒ thao tác xếp hàng)');
dong('thao tác đang xếp hàng', s.globalLock.currentQueue.total, s.globalLock.currentQueue.total > 10);
const tre = (k) => { const x = s.opLatencies[k]; return x.ops ? x.latency / x.ops / 1000 : 0; };
dong('trễ TB đọc / ghi (từ lúc chạy)', `${tre('reads').toFixed(2)} / ${tre('writes').toFixed(2)} ms`, tre('reads') > 50 || tre('writes') > 50, '(trung bình — chỉ để thấy xu hướng)');
try {
  const rs = db.adminCommand({ replSetGetStatus: 1 });
  const p = rs.members.find((m) => m.state === 1);
  dong('replica set', `${rs.set}: ${rs.members.map((m) => m.stateStr).join(', ')}`, !p, p ? '' : '(KHÔNG có PRIMARY ⇒ không ghi được)');
  for (const m of rs.members.filter((m) => m.state === 2)) {
    const lag = (p.optimeDate - m.optimeDate) / 1000;
    dong(`độ trễ chép ${m.name}`, lag + ' s', lag > 30);
  }
  const o = db.getSiblingDB('local').oplog.rs;
  const dau = o.find().sort({ $natural: 1 }).limit(1).next().ts.t, cuoi = o.find().sort({ $natural: -1 }).limit(1).next().ts.t;
  const gio = (cuoi - dau) / 3600;
  dong('cửa sổ oplog', gio.toFixed(1) + ' giờ', gio < 24, '(< 24 giờ ⇒ PITR/secondary dừng lâu sẽ hụt)');
} catch (e) { dong('replica set', 'không phải replica set', true, '(không có oplog ⇒ không PITR, không failover)'); }
dong('assert người dùng (từ lúc chạy)', s.asserts.user, false, '(lỗi phía client: trùng khoá, sai lệnh… — nhìn độ TĂNG)');
print(canh ? `⇒ ${canh} cảnh báo` : '⇒ khoẻ');
