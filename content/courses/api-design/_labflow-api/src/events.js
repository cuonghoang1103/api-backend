// events.js — Chương 10: MỘT dòng sự kiện cho cả LabFlow (sự kiện 10.3, realtime 10.4, webhook 10.5–10.6)
//   LABFLOW_EVENTS = memory (mặc định: vòng đệm trong RAM, id là số tăng dần — chỉ MỘT instance)
//                  | redis  (Redis Stream "labflow:events": id do Redis cấp, mọi instance cùng đọc, worker đọc được)
// Phong bì theo CloudEvents 1.0 (bài 10.3): id, source, type có số phiên bản, time, subject, data.
import { EventEmitter } from 'node:events';
import { createClient } from 'redis';
import { config } from './config.js';

const MODE = config.events;                                       // Chương 12: kho pg + Redis ⇒ mặc định redis
const KEEP = Number(process.env.EVENTS_KEEP ?? 1000);             // giữ bao nhiêu sự kiện để client nối lại lấy bù
export const STREAM = 'labflow:events';
const bus = new EventEmitter().setMaxListeners(0);
const ring = [];                                                  // memory: [{ id, ... }] cũ → mới
let seq = 0;

export const envelope = (type, subject, data) => ({
  specversion: '1.0', type, source: '/labflow/v2', subject,
  time: new Date().toISOString(), datacontenttype: 'application/json', data,
});

let pub = null, sub = null;
if (MODE === 'redis') {
  const url = process.env.LABFLOW_REDIS ?? 'redis://localhost:6390';
  pub = createClient({ url }); sub = createClient({ url });
  for (const c of [pub, sub]) c.on('error', (e) => console.error('redis events', e.message));
  await Promise.all([pub.connect(), sub.connect()]);
  // Mỗi instance tự đọc đuôi stream ⇒ sự kiện sinh ở instance A cũng tới client đang nối vào instance B
  (async () => {
    let last = '$';
    for (;;) {
      const r = await sub.xRead({ key: STREAM, id: last }, { BLOCK: 0, COUNT: 100 }).catch((e) => (console.error(e.message), null));
      for (const m of r?.[0]?.messages ?? []) { last = m.id; bus.emit('event', { id: m.id, ...JSON.parse(m.message.e) }); }
    }
  })();
}

// Phát một sự kiện. memory: id = số thứ tự. redis: XADD … MAXLEN ~ KEEP, id = id của Redis (ms-seq)
export async function publish(type, subject, data) {
  const e = envelope(type, subject, data);
  if (MODE === 'redis') {
    const id = await pub.xAdd(STREAM, '*', { e: JSON.stringify(e) }, { TRIM: { strategy: 'MAXLEN', strategyModifier: '~', threshold: KEEP } });
    return { id, ...e };                                          // client nhận qua vòng xRead ở trên (kể cả instance này)
  }
  const ev = { id: String(++seq), ...e };
  ring.push(ev);
  if (ring.length > KEEP) ring.shift();
  bus.emit('event', ev);
  return ev;
}

// Sự kiện SAU id `after` (không gồm nó). gap = true ⇒ `after` đã rơi khỏi vùng giữ: client phải tải lại trạng thái
export async function since(after, limit = 100) {
  if (MODE === 'redis') {
    const first = (await pub.xRange(STREAM, '-', '+', { COUNT: 1 }))[0]?.id;
    const gap = !!(after && first && cmpId(after, first) < 0);
    const ms = await pub.xRange(STREAM, after ? `(${after}` : '-', '+', { COUNT: limit });
    return { gap, data: ms.map((m) => ({ id: m.id, ...JSON.parse(m.message.e) })) };
  }
  const n = after ? Number(after) : 0;
  const gap = ring.length > 0 && n < Number(ring[0].id) - 1;
  return { gap, data: ring.filter((e) => Number(e.id) > n).slice(0, limit) };
}

export const latestId = async () => (MODE === 'redis'
  ? (await pub.xRevRange(STREAM, '+', '-', { COUNT: 1 }))[0]?.id ?? '0-0'
  : String(seq));
export const subscribe = (fn) => { bus.on('event', fn); return () => bus.off('event', fn); };
export const eventsMode = MODE;

// So hai id sự kiện (memory: "42"; redis: "1761980000000-3") ⇒ -1 / 0 / 1
export function cmpId(a, b) {
  if (MODE !== 'redis') return Math.sign(Number(a) - Number(b));
  const [x, y] = a.split('-').map(BigInt), [u, v] = b.split('-').map(BigInt);
  return x === u ? (y > v) - (y < v) : (x > u) - (x < u);
}
