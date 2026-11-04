// Ch5 · máy chủ UDP tí hon: ĐẾM mọi gói dữ liệu; "DEM" ⇒ trả số đếm; "RESET" ⇒ về 0; "ECHO" ⇒ vọng lại.
import dgram from 'node:dgram';
const s = dgram.createSocket('udp4');
let n = 0;
s.on('message', (msg, rinfo) => {
  const m = String(msg);
  if (m === 'DEM') s.send(`đã nhận ${n}/20 gói`, rinfo.port, rinfo.address);
  else if (m === 'RESET') { n = 0; s.send('ok', rinfo.port, rinfo.address); }
  else if (m === 'ECHO') s.send('vọng-lại\n', rinfo.port, rinfo.address);
  else n++;
});
s.bind(9999, '0.0.0.0', () => console.log('udp server on 0.0.0.0:9999'));
