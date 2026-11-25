// Tự kiểm dự án cuối khoá (Bài 11.1) — đọc một database và chỉ ra chỗ sẽ mất điểm TRƯỚC khi hội đồng chỉ ra.
// Chạy: docker exec mgo-lab mongosh --quiet <database> --eval "var TV='/demo/<tệp truy vấn chính>.js'" /demo/kiem-du-an.js
// Tệp truy vấn chính (TV, tuỳ chọn) khai: const TRUY_VAN = [{ ten, coll, loc, sapXep }] — mỗi màn hình/endpoint quan trọng một dòng.
// CHỈ ĐỌC: không ghi gì vào database. Kết quả: ✔ ổn · ⚠ nên xem · ✘ sẽ mất điểm.
let dat = 0, canhBao = 0, truot = 0;
const in_ = (muc, chu) => { if (muc === '✔') dat++; else if (muc === '⚠') canhBao++; else truot++; print(`${muc} ${chu}`); };
const colls = db.getCollectionInfos({ type: 'collection' }).filter((c) => !c.name.startsWith('system.'));
print(`== ${db.getName()}: ${colls.length} collection ==`);

print('-- 1. Schema có kiểm hợp lệ (Chương 1) --');
for (const c of colls) {
  const v = c.options.validator;
  if (!v) in_('✘', `${c.name}: không có validator — gõ sai tên trường vẫn được ghi`);
  else in_('✔', `${c.name}: validator ${v.$jsonSchema ? '$jsonSchema' : 'biểu thức truy vấn'} · ${c.options.validationAction || 'error'}/${c.options.validationLevel || 'strict'}`);
}

print('-- 2. Hình dạng tài liệu và cỡ (Chương 1, 3) --');
for (const c of colls) {
  const r = db[c.name].aggregate([{ $sample: { size: 1000 } },
    { $project: { k: { $map: { input: { $objectToArray: '$$ROOT' }, in: '$$this.k' } }, b: { $bsonSize: '$$ROOT' } } },
    { $group: { _id: { $sortArray: { input: '$k', sortBy: 1 } }, n: { $sum: 1 }, lon: { $max: '$b' } } }, { $sort: { n: -1 } }]).toArray();
  if (!r.length) { in_('⚠', `${c.name}: rỗng`); continue; }
  const lon = Math.max(...r.map((x) => x.lon));
  in_(r.length > 3 ? '⚠' : '✔', `${c.name}: ${r.length} hình dạng trong mẫu 1000 · tài liệu lớn nhất ${(lon / 1024).toFixed(1)} KB`);
  if (lon > 1024 * 1024) in_('✘', `${c.name}: có tài liệu > 1 MB — kiểm mảng không giới hạn (Bài 3.5)`);
}

print('-- 3. Index (Chương 4) --');
for (const c of colls) {
  const st = db[c.name].aggregate([{ $indexStats: {} }]).toArray().filter((x) => x.name !== '_id_');
  const khong = st.filter((x) => Number(x.accesses.ops) === 0).map((x) => x.name);
  in_(khong.length ? '⚠' : '✔', `${c.name}: ${st.length} index ngoài _id${khong.length ? ' · chưa được dùng từ lúc khởi động: ' + khong.join(', ') : ''}`);
}
if (typeof TV !== 'undefined') {
  load(TV);
  for (const q of TRUY_VAN) {
    const ex = db[q.coll].find(q.loc).sort(q.sapXep || {}).limit(q.gioiHan || 20).explain('executionStats');
    const g = []; const di = (o) => { if (o && typeof o === 'object') { if (o.stage) g.push(o.stage); Object.values(o).forEach(di); } }; di(ex.queryPlanner.winningPlan);
    const s = ex.executionStats, tiLe = s.nReturned ? (s.totalDocsExamined / s.nReturned).toFixed(1) : s.totalDocsExamined;
    const muc = g.includes('COLLSCAN') ? '✘' : (g.includes('SORT') || tiLe > 3) ? '⚠' : '✔';
    in_(muc, `truy vấn "${q.ten}": ${g.join(' ← ')} · trả ${s.nReturned} · quét ${s.totalKeysExamined} khoá / ${s.totalDocsExamined} tài liệu · ${s.executionTimeMillis} ms`);
  }
} else in_('⚠', 'chưa khai tệp truy vấn chính (TV) — không kiểm được explain');

print('-- 4. Sẵn sàng (Chương 6, 7) --');
const hello = db.hello();
if (!hello.setName) in_('✘', 'không phải replica set — không có transaction, không chịu được mất máy');
else {
  const cfg = rs.conf();
  const tv = cfg.members.filter((m) => !m.arbiterOnly).length, tt = cfg.members.filter((m) => m.arbiterOnly).length;
  in_(tv >= 3 && !tt ? '✔' : tv >= 3 ? '⚠' : '✘', `replica set ${hello.setName}: ${tv} thành viên mang dữ liệu${tt ? ', ' + tt + ' arbiter' : ''}${tv < 3 ? ' — cần 3 để mất một máy vẫn ghi majority' : ''}`);
}
const rw = db.adminCommand({ getDefaultRWConcern: 1 });
const w = rw.defaultWriteConcern ? rw.defaultWriteConcern.w : '?';
in_(w === 'majority' ? '✔' : '✘', `write concern mặc định của cụm: w=${w} (nguồn: ${rw.defaultWriteConcernSource || '?'})`);

print('-- 5. Bảo mật (Chương 9) --');
const opt = db.adminCommand({ getCmdLineOpts: 1 }).parsed;
const auth = (opt.security && opt.security.authorization) === 'enabled' || !!(opt.security && opt.security.keyFile);
in_(auth ? '✔' : '✘', `xác thực: ${auth ? 'bật' : 'TẮT — ai tới được cổng là đọc/xoá được hết (làn sóng tống tiền 2017)'}`);
const bind = String((opt.net && opt.net.bindIp) || (opt.net && opt.net.bindIpAll ? '*' : '127.0.0.1'));
const moHet = bind === '*' || bind.includes('0.0.0.0');
in_(moHet ? '⚠' : '✔', `bindIp: ${bind}${moHet ? ' (mọi giao diện mạng) — chỉ chấp nhận khi cổng không xuất ra ngoài (compose 127.0.0.1:…)' : ''}`);
const cheDoTls = opt.net && opt.net.tls ? opt.net.tls.mode : undefined;
in_(cheDoTls === 'requireTLS' ? '✔' : '⚠', `TLS: ${cheDoTls || 'không bật'}${cheDoTls === 'requireTLS' ? '' : ' — mật khẩu và dữ liệu đi trên mạng dạng rõ (Bài 9.4)'}`);
print(`== TỔNG: ${dat} ✔ · ${canhBao} ⚠ · ${truot} ✘ ==`);
