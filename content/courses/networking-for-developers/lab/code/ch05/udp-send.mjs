// Ch5 · gửi 20 gói UDP qua đường hay mất, rồi hỏi máy chủ đếm được bao nhiêu — "gửi rồi quên", mất thì mất luôn.
import dgram from 'node:dgram';
const host = '10.10.2.10', N = 20;
const s = dgram.createSocket('udp4');
let i = 0, done = false;
s.on('message', (m) => { if (done) return; done = true; console.log(`client đã gửi ${N} gói; ${m}`); s.close(); });
const tick = () => {
  if (i < N) { s.send(`goi-${i}`, 9999, host); i++; setTimeout(tick, 15); }
  else { let k = 0; const ask = () => { if (!done && k < 4) { s.send('DEM', 9999, host); k++; setTimeout(ask, 250); } }; setTimeout(ask, 300); }
};
setTimeout(() => { if (!done) { console.log('client: không nhận được số đếm (gói DEM cũng bị mất)'); s.close(); } }, 4000);
tick();
