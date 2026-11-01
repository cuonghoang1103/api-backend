// server.mjs — bài 11.3: API gửi tin nhắn chat, đo trùng tin khi mạng di động rớt phản hồi
// PORT=4123 DEDUPE=0|1 DROP_EVERY=4 node interview/chat/server.mjs
import express from 'express';

const PORT = Number(process.env.PORT ?? 4123);
const DEDUPE = process.env.DEDUPE === '1';
const DROP_EVERY = Number(process.env.DROP_EVERY ?? 0);            // CHỈ để học: cứ N request thì LƯU xong rồi cắt kết nối, không trả lời
const convs = new Map();                                            // cid ⇒ { seq, messages: [], byClientId: Map }
let n = 0;

const conv = (cid) => convs.get(cid) ?? convs.set(cid, { seq: 0, messages: [], byClientId: new Map() }).get(cid);
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '8kb' }));

app.post('/v1/conversations/:cid/messages', (req, res) => {
  const c = conv(req.params.cid);
  const { clientMessageId, text, sentAt, device } = req.body ?? {};
  if (typeof text !== 'string' || !text.trim() || text.length > 4000) return res.status(422).json({ code: 'INVALID_TEXT' });
  if (DEDUPE) {
    if (typeof clientMessageId !== 'string') return res.status(400).json({ code: 'CLIENT_MESSAGE_ID_REQUIRED' });
    const old = c.byClientId.get(clientMessageId);
    if (old) return res.status(200).set('Idempotent-Replayed', 'true').json(old);   // gửi lại ⇒ trả đúng tin cũ
  }
  const m = { id: `msg_${req.params.cid}_${c.seq + 1}`, seq: ++c.seq, clientMessageId, text, sentAt, device, receivedAt: new Date().toISOString() };
  c.messages.push(m);
  if (DEDUPE) c.byClientId.set(clientMessageId, m);
  if (DROP_EVERY && ++n % DROP_EVERY === 0) return req.socket.destroy();   // đã LƯU, nhưng điện thoại không nhận được 201
  res.status(201).json(m);
});

// đồng bộ nhiều thiết bị: mỗi thiết bị nhớ seq cuối đã thấy và hỏi phần sau nó
app.get('/v1/conversations/:cid/messages', (req, res) => {
  const after = Number(req.query.after ?? 0), limit = Math.min(Number(req.query.limit ?? 50), 500);
  const data = conv(req.params.cid).messages.filter((m) => m.seq > after).slice(0, limit);
  res.json({ data, page: { next: data.length === limit ? String(data.at(-1).seq) : null } });
});

app.listen(PORT, () => console.log(`chat :${PORT} DEDUPE=${DEDUPE} DROP_EVERY=${DROP_EVERY}`));
