// loop-lag.js — event loop của Node khi đọc FILE: 16 "request" cùng đọc 16 file lạnh 4 MiB, trong lúc đo độ trễ tệ nhất
// của: vòng lặp (setInterval 10 ms), một echo MẠNG cục bộ, dns.lookup('localhost') và fs.stat('/etc/hosts').
//   node loop-lag.js sync|async
const fs = require('node:fs'), net = require('node:net'), dns = require('node:dns');
const { execFileSync } = require('node:child_process');
const mode = process.argv[2];
const files = Array.from({ length: 16 }, (_, i) => `/tmp/f${i}`);
execFileSync('./evict', files);                                   // đẩy khỏi page cache: đọc LẠNH từ đĩa
const t0 = performance.now(), ms = () => (performance.now() - t0).toFixed(0);
const worst = { loop: 0, echo: 0, dns: 0, stat: 0 };
let last = performance.now();
const tick = setInterval(() => { const now = performance.now(); worst.loop = Math.max(worst.loop, now - last - 10); last = now; }, 10);

const srv = net.createServer((s) => s.pipe(s)).listen(0, () => {   // echo cục bộ: việc MẠNG thuần
  const c = net.connect(srv.address().port);
  let sent = 0;
  c.on('data', () => { worst.echo = Math.max(worst.echo, performance.now() - sent); });
  const probe = setInterval(() => {
    sent = performance.now(); c.write('x');
    const d = performance.now(); dns.lookup('localhost', () => { worst.dns = Math.max(worst.dns, performance.now() - d); });
    const s = performance.now(); fs.stat('/etc/hosts', () => { worst.stat = Math.max(worst.stat, performance.now() - s); });
  }, 20);
  setTimeout(() => {
    console.log(`${mode}: 16 requests start reading 16 cold 4 MiB files at ${ms()} ms`);
    if (mode === 'sync') {
      for (const f of files) fs.readFileSync(f);                     // chặn luồng JS
      console.log(`${mode}: all files read at ${ms()} ms`);
    } else {
      let left = files.length;
      for (const f of files) fs.readFile(f, () => { if (--left === 0) console.log(`${mode}: all files read at ${ms()} ms`); });
    }
  }, 200);
  setTimeout(() => {
    clearInterval(tick); clearInterval(probe); c.destroy(); srv.close();
    const f = (x) => x.toFixed(0).padStart(5);
    console.log(`worst delay (ms): event loop ${f(worst.loop)} | net echo ${f(worst.echo)} | dns.lookup ${f(worst.dns)} | fs.stat ${f(worst.stat)}`);
  }, 2600);
});
