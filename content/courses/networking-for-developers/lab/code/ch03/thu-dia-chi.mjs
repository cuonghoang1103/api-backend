// thu-dia-chi.mjs — Node mở kết nối tới app.labflow.test khi DNS trả [.12 (chết), .10]: bao lâu thì kết nối được?
// autoSelectFamily (mặc định bật từ Node 20) thử lần lượt từng địa chỉ, mỗi lần chờ tối đa autoSelectFamilyAttemptTimeout.
import net from 'node:net';
const lookup = (host, opts, cb) => cb(null, [{ address: '203.0.113.12', family: 4 }, { address: '203.0.113.10', family: 4 }]);
console.log('attempt timeout:', net.getDefaultAutoSelectFamilyAttemptTimeout(), 'ms');
const t = performance.now();
const s = net.connect({ host: 'app.labflow.test', port: 80, lookup }, () => {
  console.log(`connected to ${s.remoteAddress} after ${(performance.now() - t).toFixed(0)} ms`);
  s.destroy();
});
