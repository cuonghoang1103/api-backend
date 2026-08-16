/**
 * Kiểm LỚP HTTP của /api/v1/agent/turn — chạy tay khi cần, không nằm trong CI.
 *
 * `agent:check` gọi thẳng động cơ nên nó KHÔNG chạm tới: header SSE, phân tích
 * thân JSON của express, thứ tự middleware xác thực, và việc khung sự kiện có
 * ra khỏi socket theo từng gói hay bị đệm lại thành một cục. Đó đúng là những
 * chỗ hỏng âm thầm — bài học "log đường chính sạch không chứng minh gì".
 *
 *   npx tsx scripts/agent-http-check.ts [--port 3001] [--user 5]
 */
import jwt from 'jsonwebtoken';
import { config } from '../src/config/env.js';

const argv = process.argv.slice(2);
const arg = (ten: string, mac: string): string => {
  const i = argv.indexOf(`--${ten}`);
  return i >= 0 ? argv[i + 1] : mac;
};
const port = arg('port', '3001');
const userId = Number(arg('user', '5'));

const token = jwt.sign({ userId }, config.jwtSecret, { expiresIn: '10m' });
const goc = `http://localhost:${port}/api/v1/agent`;

// ── 1. GET /tools có token ──
const rTools = await fetch(`${goc}/tools`, { headers: { Authorization: `Bearer ${token}` } });
const tools = await rTools.json() as any;
console.log(`GET /tools → ${rTools.status}, ${tools?.data?.tools?.length} tool, model=${tools?.data?.model}, khoá=${tools?.data?.configured}, pro=${tools?.data?.pro}`);
console.log(`  trần: ${(tools?.data?.limits?.tokenCap / 1e6).toFixed(1)}tr token / ${tools?.data?.limits?.windowHours}h`);

// ── 1b. GET /usage ──
const rUse = await fetch(`${goc}/usage`, { headers: { Authorization: `Bearer ${token}` } });
const use = await rUse.json() as any;
console.log(`GET /usage → ${rUse.status}, đã dùng ${use?.data?.daDung?.toLocaleString('vi-VN')}/${use?.data?.tran?.toLocaleString('vi-VN')} (${use?.data?.phanTram}%), hồi lúc ${use?.data?.hoiLucNao ?? '—'}`);

// ── 1c. Cổng Pro: người KHÔNG Pro phải bị 403, không phải 401 ──
if (!tools?.data?.pro) {
  const rCam = await fetch(`${goc}/turn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'chào' }], capabilities: [] }),
  });
  const j = await rCam.json().catch(() => ({})) as any;
  const dung = rCam.status === 403 && j?.code === 'PRO_REQUIRED';
  console.log(`POST /turn (không Pro) → ${rCam.status} ${j?.code} ${dung ? '✓ chặn đúng' : '✗ SAI — phải 403/PRO_REQUIRED'}`);
  if (!dung) process.exit(1);
  console.log('\n(người dùng này chưa Pro nên dừng ở đây — chạy lại với --user <id Pro> để kiểm luồng đầy đủ)');
  process.exit(0);
}

// ── 2. POST /turn — đọc stream, đo lúc từng khung tới nơi ──
const t0 = Date.now();
const r = await fetch(`${goc}/turn`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Tôi có ghi chú nào không? Trả lời thật ngắn.' }],
    capabilities: ['fs_read'],
    workspace: { name: 'du-an-thu', platform: process.platform },
  }),
});

console.log(`POST /turn → ${r.status} ${r.headers.get('content-type')} | X-Accel-Buffering: ${r.headers.get('x-accel-buffering')}`);
if (!r.ok || !r.body) { console.log(await r.text()); process.exit(1); }

const reader = r.body.getReader();
const dec = new TextDecoder();
let buf = '';
const moc: Array<[number, string]> = [];
for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  buf += dec.decode(value, { stream: true });
  const dong = buf.split('\n');
  buf = dong.pop() ?? '';
  for (const d of dong) {
    if (!d.startsWith('data: ')) continue;
    const e = JSON.parse(d.slice(6));
    const ms = Date.now() - t0;
    if (e.type === 'text') { if (!moc.some(([, t]) => t === 'text')) moc.push([ms, 'text']); }
    else moc.push([ms, e.type === 'done' ? `done(${e.stop}, +${e.append.length} tin nhắn, $${e.usage.costUsd.toFixed(4)})` : e.type === 'tool_call' ? `tool_call(${e.name})` : e.type === 'error' ? `error(${e.error})` : e.type]);
  }
}
console.log('khung nhận được:');
for (const [ms, ten] of moc) console.log(`  ${String(ms).padStart(6)}ms  ${ten}`);

const nhieuGoi = new Set(moc.map(([ms]) => ms)).size > 1;
console.log(nhieuGoi ? '\n✓ khung về RẢI RÁC theo thời gian — stream thật, không bị đệm thành một cục' : '\n✗ mọi khung về cùng một mốc — đang bị đệm ở đâu đó');
