// webhooks/replay.mjs — bài 10.6: kẻ tấn công bắt được MỘT request webhook hợp lệ (DUMP của receiver) và gửi lại.
//   node webhooks/replay.mjs dump.json            gửi lại y nguyên
//   node webhooks/replay.mjs dump.json --tamper   sửa body ("PENDING" ⇒ "CANCELLED") nhưng giữ chữ ký cũ
import { readFileSync } from 'node:fs';
const { headers, body } = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const tamper = process.argv.includes('--tamper');
const sent = tamper ? body.replace('"PENDING"', '"CANCELLED"') : body;
const r = await fetch(process.env.TARGET ?? 'http://localhost:4005/hooks', { method: 'POST', body: sent, headers: {
  'content-type': 'application/json', 'webhook-id': headers['webhook-id'], 'webhook-timestamp': headers['webhook-timestamp'], 'webhook-signature': headers['webhook-signature'] } });
const age = Math.round(Date.now() / 1000 - Number(headers['webhook-timestamp']));
console.log(`${tamper ? 'body đã sửa' : 'gửi lại y nguyên'} (chữ ký ký ${age} s trước) ⇒ ${r.status} ${await r.text()}`);
