// Ch4 · 4.5 — máy chủ nhỏ cho demo Nagle: đọc đủ 8 byte (yêu cầu) rồi mới trả 1 byte.
import net from 'node:net';
net.createServer((s) => { let n = 0; s.on('data', (d) => { n += d.length; if (n >= 8) { s.write('R'); n = 0; } }); }).listen(3100, '0.0.0.0');
