// cau-sock.mjs — cầu TCP ⇄ Unix socket để Chromium MÁY NHÀ vào được Vite chạy trong container --network none (KHÔNG tạo mạng docker).
//   máy nhà:   node cau-sock.mjs ngoai 41970 ~/.rtq-wdp/sock/web.sock   (nghe 127.0.0.1:41970 ⇒ socket)
//   container: node /cau/cau-sock.mjs trong /sock/web.sock 5173          (socket ⇒ 127.0.0.1:5173 trong netns)
import net from 'node:net';
import fs from 'node:fs';
const [che, a, b] = process.argv.slice(2);
const noi = (c, s) => { c.pipe(s); s.pipe(c); s.on('error', () => c.destroy()); c.on('error', () => s.destroy()); };
if (che === 'ngoai') net.createServer((c) => noi(c, net.connect(b))).listen(Number(a), '127.0.0.1');
else { try { fs.unlinkSync(a); } catch {} net.createServer((c) => noi(c, net.connect(Number(b), '127.0.0.1'))).listen(a, () => fs.chmodSync(a, 0o666)); }
