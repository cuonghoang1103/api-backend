// Bài 9.1 — tự kiểm một máy MongoDB của CHÍNH MÌNH (chỉ đọc cấu hình, không ghi gì).
//   mongosh "<chuỗi kết nối>" --quiet tu-kiem.js
// Cần quyền đọc getCmdLineOpts/buildInfo (vai trò clusterMonitor là đủ).
const VA = { '4.4': '4.4.30', '5.0': '5.0.32', '6.0': '6.0.27', '7.0': '7.0.28', '8.0': '8.0.17', '8.2': '8.2.3' }; // NVD CVE-2025-14847
const so = (v) => v.split('.').map(Number);
const nhoHon = (a, b) => { const x = so(a), y = so(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i]; return false; };

const opts = db.adminCommand({ getCmdLineOpts: 1 }).parsed;
const ban = db.version();
const nhanh = ban.split('.').slice(0, 2).join('.');
const kq = [];
const ghi = (ok, viec, chiTiet) => kq.push(`${ok ? 'OK  ' : 'LỖI '} ${viec.padEnd(26)} ${chiTiet}`);

const bind = opts.net?.bindIp ?? (opts.net?.bindIpAll ? '*' : '127.0.0.1 (mặc định)');
ghi(bind !== '*' && bind !== '0.0.0.0', 'bindIp', `${bind}${bind === '*' ? '  ⇒ nghe mọi giao diện, chỉ an toàn nếu tầng ngoài chặn' : ''}`);
const auth = opts.security?.authorization ?? (opts.security?.keyFile ? 'enabled (keyFile)' : 'disabled');
ghi(String(auth).startsWith('enabled'), 'security.authorization', auth);
const fix = VA[nhanh];
ghi(fix ? !nhoHon(ban, fix) : false, 'CVE-2025-14847', fix ? `bản ${ban}, vá từ ${fix}` : `bản ${ban}: nhánh hết hỗ trợ/không có bản vá ⇒ nâng cấp`);
const nen = opts.net?.compression?.compressors ?? 'snappy,zstd,zlib (mặc định)';
ghi(!String(nen).includes('zlib'), 'net.compression', nen);
ghi(opts.security?.javascriptEnabled === false, 'javascriptEnabled', String(opts.security?.javascriptEnabled ?? 'true (mặc định)'));
const tls = opts.net?.tls?.mode ?? 'disabled';
ghi(tls === 'requireTLS', 'net.tls.mode', tls);
print(kq.join('\n'));
