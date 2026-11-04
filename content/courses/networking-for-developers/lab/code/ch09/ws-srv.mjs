// Ch9 lab — máy chủ WebSocket THÔ (:5200), viết tay bằng http + crypto, KHÔNG dùng thư viện, để thấy rõ giao thức RFC 6455.
// Bắt tay: nâng cấp từ HTTP/1.1 (Upgrade: websocket) → 101 + Sec-WebSocket-Accept = base64(sha1(key + GUID)).
// Khung: giải mã khung client (có mặt nạ), trả: text ⇒ echo, ping ⇒ pong, close ⇒ close.
import http from 'node:http';
import crypto from 'node:crypto';

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';   // hằng số cố định của RFC 6455

function accept(key) {
  return crypto.createHash('sha1').update(key + GUID).digest('base64');
}

// Đóng một khung server→client (KHÔNG mặt nạ). opcode: 0x1 text, 0x8 close, 0xA pong.
function frame(opcode, payload = Buffer.alloc(0)) {
  const len = payload.length;
  const head = len < 126 ? Buffer.from([0x80 | opcode, len]) : Buffer.from([0x80 | opcode, 126, len >> 8, len & 0xff]);
  return Buffer.concat([head, payload]);
}

const server = http.createServer((req, res) => { res.writeHead(426); res.end('Upgrade Required\n'); });

server.on('upgrade', (req, socket) => {
  const key = req.headers['sec-websocket-key'];
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept(key)}\r\n\r\n`,
  );

  socket.on('data', (buf) => {
    const opcode = buf[0] & 0x0f;
    const masked = (buf[1] & 0x80) !== 0;
    let len = buf[1] & 0x7f, off = 2;
    if (len === 126) { len = buf.readUInt16BE(2); off = 4; }
    const mask = masked ? buf.slice(off, off + 4) : null; if (masked) off += 4;
    const data = buf.slice(off, off + len);
    if (mask) for (let i = 0; i < data.length; i++) data[i] ^= mask[i & 3];   // bỏ mặt nạ

    if (opcode === 0x8) { socket.write(frame(0x8)); socket.end(); return; }    // close
    if (opcode === 0x9) { socket.write(frame(0xA, data)); return; }            // ping → pong
    if (opcode === 0x1) { socket.write(frame(0x1, Buffer.from('echo: ' + data.toString()))); }  // text → echo
  });
});

server.listen(5200, '0.0.0.0', () => console.log('ws-srv on 0.0.0.0:5200'));
