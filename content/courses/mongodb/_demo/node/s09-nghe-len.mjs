// Bài 9.4 — "kẻ đứng giữa" tí hon: chuyển tiếp TCP 127.0.0.1:47026 ⇒ cổng đích và in các đoạn chữ đọc được trên đường truyền.
// Giống thứ một người cùng Wi-Fi quán cà phê / một máy bị chiếm trong cùng mạng nội bộ nhìn thấy. CHỈ dùng trên lab của mình.
//   node s09-nghe-len.mjs <cổng đích> [giây]
import net from 'node:net';
const dich = Number(process.argv[2]), giay = Number(process.argv[3] ?? 6);
const thay = new Set();
const soi = (huong, buf) => {
  for (const m of buf.toString('latin1').matchAll(/[\x20-\x7e]{6,}/g)) {
    const s = m[0];
    if (/^(find|insert|filter|ctshop|0901|admin|kh\d|saslStart|SCRAM|n=|r=|ten|sdt)/.test(s) || /0901|@vd\.vn/.test(s)) thay.add(`${huong} ${s.slice(0, 60)}`);
  }
};
const may = net.createServer((c) => {
  const s = net.connect(dich, '127.0.0.1');
  c.on('data', (b) => { soi('C→S', b); s.write(b); });
  s.on('data', (b) => { soi('S→C', b); c.write(b); });
  c.on('error', () => s.destroy()); s.on('error', () => c.destroy());
  c.on('close', () => s.end()); s.on('close', () => c.end());
}).listen(47026, '127.0.0.1');
setTimeout(() => {
  const ds = [...thay];
  console.log(ds.length ? ds.slice(0, 12).join('\n') : '(không thấy đoạn chữ nào đọc được — toàn byte đã mã hoá)');
  may.close(); process.exit(0);
}, giay * 1000);
