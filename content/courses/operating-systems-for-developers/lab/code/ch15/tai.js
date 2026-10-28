// tai.js — máy tạo tải nhỏ, hai chế độ, để THẤY coordinated omission (bài 15.6, 15.8).
//   node tai.js URL --closed C --duration S       vòng KÍN: C "người dùng", mỗi người gửi xong mới gửi tiếp (kiểu wrk/hey/ab)
//   node tai.js URL --rate R --duration S [--conns K]
//                                                 vòng MỞ: request được LÊN LỊCH đều R/giây bất kể máy chủ nhanh hay chậm
//                                                 (kiểu k6 constant-arrival-rate, wrk2). In HAI con số độ trễ:
//     "from intended start" = từ lúc request LẼ RA được gửi (người dùng thật bấm nút lúc đó) ⇒ đúng
//     "from actual send"    = từ lúc request thật sự được gán socket (máy chủ bận thì gửi trễ) ⇒ bỏ sót thời gian chờ
const http = require('node:http');
const a = process.argv.slice(2);
const url = new URL(a[0]);
const opt = (k, d) => { const i = a.indexOf('--' + k); return i >= 0 ? +a[i + 1] : d; };
const dur = opt('duration', 10) * 1000, rate = opt('rate', 0), closed = opt('closed', 0), conns = opt('conns', 256);
const agent = new http.Agent({ keepAlive: true, maxSockets: closed || conns });
const now = () => Number(process.hrtime.bigint()) / 1e6;
const lat = [], latSend = [];
let ok = 0, err = 0, sent = 0;

function one(intended) {
  return new Promise((done) => {
    let tSend = null;
    sent++;
    const req = http.get({ host: url.hostname, port: url.port, path: url.pathname + url.search, agent }, (res) => {
      res.resume();
      res.on('end', () => {
        const t = now();
        if (res.statusCode === 200) { ok++; lat.push(t - intended); latSend.push(t - (tSend ?? intended)); } else err++;
        done();
      });
    });
    req.on('socket', () => { tSend = now(); });
    req.on('error', () => { err++; done(); });
  });
}
const pct = (arr, p) => { if (!arr.length) return NaN; const s = [...arr].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.ceil((p / 100) * s.length) - 1)]; };
const line = (name, arr) => `${name}  p50 ${pct(arr, 50).toFixed(1).padStart(6)}  p95 ${pct(arr, 95).toFixed(1).padStart(6)}  p99 ${pct(arr, 99).toFixed(1).padStart(6)}  max ${Math.max(...arr).toFixed(1).padStart(6)} ms`;

(async () => {
  const t0 = now();
  if (closed) {
    await Promise.all(Array.from({ length: closed }, async () => { while (now() - t0 < dur) await one(now()); }));
  } else {
    const pending = [];
    let i = 0;
    await new Promise((fin) => {
      const tick = () => {
        const t = now();
        while (t0 + (i * 1000) / rate <= t && (i * 1000) / rate < dur) { pending.push(one(t0 + (i * 1000) / rate)); i++; }
        if ((i * 1000) / rate >= dur) return fin();
        setTimeout(tick, 1);
      };
      tick();
    });
    await Promise.all(pending);
  }
  const secs = (now() - t0) / 1000;
  console.log(`${closed ? `closed loop, ${closed} connection(s)` : `open loop, ${rate} req/s scheduled`}: ${ok} ok, ${err} errors in ${secs.toFixed(1)} s = ${(ok / secs).toFixed(0)} req/s`);
  console.log(line('latency from intended start', lat));
  if (!closed) console.log(line('latency from actual send   ', latSend));
  agent.destroy();
})();
