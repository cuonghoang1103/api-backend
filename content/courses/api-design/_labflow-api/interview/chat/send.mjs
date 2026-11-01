// send.mjs — bài 11.3: hai thiết bị gửi 200 tin, mạng rớt phản hồi, client thử lại với CÙNG clientMessageId
// node interview/chat/send.mjs [http://localhost:4123]
import { randomUUID } from 'node:crypto';

const BASE = process.argv[2] ?? 'http://localhost:4123';
const cid = 'c_' + Date.now().toString(36);
const devices = [{ name: 'phone', skewMs: -120_000 }, { name: 'laptop', skewMs: 0 }];   // đồng hồ điện thoại chậm 2 phút
let attempts = 0, retried = 0;

async function send(dev, k) {
  const body = JSON.stringify({ clientMessageId: randomUUID(), text: `tin ${k}`, sentAt: new Date(Date.now() + dev.skewMs).toISOString(), device: dev.name });
  for (let i = 1; i <= 5; i++) {
    attempts++;
    try {
      const r = await fetch(`${BASE}/v1/conversations/${cid}/messages`, { method: 'POST', headers: { 'content-type': 'application/json' }, body, signal: AbortSignal.timeout(2000) });
      return r.status;
    } catch { retried++; }                                          // không nhận được trả lời: đã lưu hay chưa? không biết ⇒ gửi lại
  }
  return 'bỏ cuộc';
}

for (let k = 1; k <= 200; k++) await send(devices[k % 2], k);       // hai thiết bị gửi xen kẽ
const all = [];
for (let after = 0; ;) {
  const page = await fetch(`${BASE}/v1/conversations/${cid}/messages?after=${after}&limit=100`).then((r) => r.json());
  all.push(...page.data);
  if (!page.page.next) break;
  after = Number(page.page.next);
}
const texts = new Set(all.map((m) => m.text));
const order = (xs) => xs.map((m) => Number(m.text.slice(4)));
const misplaced = (ks) => ks.filter((k, i) => k !== i + 1).length;          // tin số k phải đứng ở vị trí k
const show = (ks) => ks.slice(0, 8).join(', ') + ', …';
const bySeq = order(all), byClock = order([...all].sort((a, b) => a.sentAt.localeCompare(b.sentAt)));
console.log(`gửi 200 tin, ${attempts} lần gọi (${retried} lần không nhận được trả lời ⇒ gửi lại)`);
console.log(`server lưu ${all.length} tin, ${texts.size} nội dung khác nhau ⇒ ${all.length - texts.size} tin trùng`);
if (all.length === texts.size) {
  console.log(`sắp theo seq của server:        tin ${show(bySeq)}  ⇒ ${misplaced(bySeq)}/200 tin sai chỗ`);
  console.log(`sắp theo sentAt của máy client: tin ${show(byClock)}  ⇒ ${misplaced(byClock)}/200 tin sai chỗ`);
}
