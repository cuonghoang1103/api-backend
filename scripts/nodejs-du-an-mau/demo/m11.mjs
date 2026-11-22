import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { io as connect } from 'socket.io-client';

const TOKENS = { 'token-an': { id: 1 }, 'token-binh': { id: 2 } }; // stands in for jwt.verify
const owners = { 10: 1 };                                          // plant 10 belongs to user 1

const http = createServer();
const io = new Server(http);
io.use((socket, next) => {                                         // authenticate ONCE, at the handshake
  const user = TOKENS[socket.handshake.auth.token];
  if (!user) return next(new Error('UNAUTHENTICATED'));
  socket.data.user = user; next();
});
io.on('connection', (socket) => {
  socket.on('plant:watch', (plantId, ack) => {                     // authorize EVERY action
    if (owners[plantId] !== socket.data.user.id) return ack({ ok: false, error: 'NOT_OWNER' });
    socket.join('plant:' + plantId); ack({ ok: true });
  });
});

http.listen(3011, async () => {
  const url = 'http://localhost:3011';
  const bad = connect(url, { auth: { token: 'forged' } });
  await new Promise((ok) => bad.on('connect_error', (e) => { console.log('forged token  ->', e.message); bad.close(); ok(); }));
  const binh = connect(url, { auth: { token: 'token-binh' } });
  console.log('binh watch 10 ->', JSON.stringify(await binh.emitWithAck('plant:watch', 10)));
  const an = connect(url, { auth: { token: 'token-an' } });
  console.log('an watch 10   ->', JSON.stringify(await an.emitWithAck('plant:watch', 10)));
  binh.on('plant:watered', () => console.log('binh got it (BUG!)'));
  an.on('plant:watered', (e) => {
    console.log('an received   ->', JSON.stringify(e));
    an.close(); binh.close(); io.close(); http.close();
  });
  io.to('plant:10').emit('plant:watered', { plantId: 10, at: '2026-11-22T08:00:00.000Z' }); // e.g. after POST /plants/10/waterings
});
