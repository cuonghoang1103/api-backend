// Ch9 lab — client WebSocket THÔ: bắt tay, gửi một khung text (CÓ mặt nạ, như mọi client bắt buộc), đọc echo, ping→pong, close.
// In từng bước để bài học thấy khung đi–về. Dùng net + crypto, không thư viện.
import net from 'node:net';
import crypto from 'node:crypto';

const [host, port] = (process.argv[2] || '10.10.2.20:5200').split(':');
const key = crypto.randomBytes(16).toString('base64');

function frame(opcode, text = '') {
  const payload = Buffer.from(text);
  const mask = crypto.randomBytes(4);
  const len = payload.length;
  const head = Buffer.from([0x80 | opcode, 0x80 | len]);                 // FIN + opcode, MASK + len
  const masked = Buffer.from(payload); for (let i = 0; i < len; i++) masked[i] ^= mask[i & 3];
  return Buffer.concat([head, mask, masked]);
}
function decode(buf) {
  const opcode = buf[0] & 0x0f; let len = buf[1] & 0x7f, off = 2;
  if (len === 126) { len = buf.readUInt16BE(2); off = 4; }
  return { opcode, text: buf.slice(off, off + len).toString() };
}

const s = net.connect(Number(port), host, () => {
  s.write(`GET / HTTP/1.1\r\nHost: ${host}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ${key}\r\nSec-WebSocket-Version: 13\r\n\r\n`);
});

let step = 0;
s.on('data', (buf) => {
  if (step === 0) {                                                     // câu trả lời bắt tay (text)
    console.log(buf.toString().split('\r\n').slice(0, 4).join('\n'));
    console.log('--- handshake OK, now frames ---');
    s.write(frame(0x1, 'hello LabFlow'));                               // gửi một khung text có mặt nạ
    step = 1; return;
  }
  const f = decode(buf);
  if (f.opcode === 0x1) { console.log('text  ← ' + f.text); s.write(frame(0x9, 'hi')); step = 2; return; }  // echo → gửi ping
  if (f.opcode === 0xA) { console.log('pong  ← (' + f.text + ')'); s.write(frame(0x8)); step = 3; return; }  // pong → gửi close
  if (f.opcode === 0x8) { console.log('close ← server closed'); s.end(); }
});
s.on('end', () => console.log('connection closed'));
