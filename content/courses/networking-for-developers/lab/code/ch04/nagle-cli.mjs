// Ch4 · 4.5 — khách: gửi một yêu cầu bị TÁCH làm hai lần ghi nhỏ (4 byte + 4 byte) rồi chờ trả lời.
// Nagle (mặc định) GIỮ lần ghi thứ hai tới khi lần đầu được báo nhận; phía kia trì hoãn ACK ⇒ kẹt ~40 ms/giao dịch.
import net from 'node:net';
function trans(noDelay, iters, done) {
  let i = 0, tot = 0;
  const loop = () => {
    const c = net.connect(3100, '10.10.2.10', () => {
      c.setNoDelay(noDelay);
      const t0 = process.hrtime.bigint();
      c.write('head'); c.write('body');        // yêu cầu = hai lần ghi nhỏ
      c.once('data', () => { tot += Number(process.hrtime.bigint() - t0) / 1e6; c.end(); });
    });
    c.on('close', () => { if (++i < iters) loop(); else { console.log(`NODELAY=${noDelay}: ${(tot / iters).toFixed(1)} ms mỗi giao dịch (trung bình ${iters} lần)`); done(); } });
  };
  loop();
}
trans(false, 6, () => trans(true, 6, () => process.exit(0)));
