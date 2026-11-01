// demo1/webhook.mjs — lesson 1.3: verifying an HMAC signature on a webhook — raw bytes, constant time, a time limit.
// LabFlow ID notifies LabFlow API ("user.disabled"); the receiver must be sure LabFlow ID sent it, and sent it recently.
import express from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';

const SECRET = process.env.DEMO_WEBHOOK_SECRET; // shared by sender and receiver (FAKE value in this demo)
const TOLERANCE_SEC = 300;
const signature = (t, raw) => createHmac('sha256', SECRET).update(`${t}.${raw}`).digest('hex');

function verifySignature(header, raw, nowSec) {
  const parts = Object.fromEntries((header ?? '').split(',').map((kv) => kv.split('=')));
  const t = Number(parts.t);
  if (!Number.isInteger(t) || !/^[0-9a-f]{64}$/.test(parts.v1 ?? '')) return 'MALFORMED';
  if (Math.abs(nowSec - t) > TOLERANCE_SEC) return 'TOO_OLD';
  const good = Buffer.from(signature(t, raw), 'hex');
  return timingSafeEqual(good, Buffer.from(parts.v1, 'hex')) ? 'OK' : 'BAD_SIGNATURE';
}

const app = express();
// Receiver 1: lets express.json() parse first, then re-serialises the body to check it.
app.post('/hooks/parsed', express.json(), (req, res) => {
  res.json({ verdict: verifySignature(req.get('labflow-signature'), JSON.stringify(req.body), Math.floor(Date.now() / 1000)) });
});
// Receiver 2: keeps the exact bytes that were signed.
app.post('/hooks/raw', express.raw({ type: 'application/json' }), (req, res) => {
  res.json({ verdict: verifySignature(req.get('labflow-signature'), req.body.toString('utf8'), Math.floor(Date.now() / 1000)) });
});
const server = app.listen(4804);

// The sender: pretty-printed JSON, exactly as LabFlow ID writes it.
const raw = JSON.stringify({ type: 'user.disabled', user: 'usr_2', at: '2026-11-01T06:00:00Z' }, null, 2);
async function send(path, t, body = raw, sig = signature(t, raw)) {
  const res = await fetch(`http://127.0.0.1:4804${path}`, {
    method: 'POST', headers: { 'content-type': 'application/json', 'labflow-signature': `t=${t},v1=${sig}` }, body,
  });
  return (await res.json()).verdict;
}
const now = Math.floor(Date.now() / 1000);
console.log('parsed body, fresh          →', await send('/hooks/parsed', now));
console.log('raw body, fresh             →', await send('/hooks/raw', now));
console.log('raw body, user changed      →', await send('/hooks/raw', now, raw.replace('usr_2', 'usr_3')));
console.log('raw body, replayed 10 min   →', await send('/hooks/raw', now - 600));
server.close();
