// perf/latency-table.mjs — bài 8.1: bảng độ trễ ĐO TRÊN MÁY NÀY cho từng việc một request LabFlow có thể làm
// Cần: LabFlow chạy ở :4000, PostgreSQL ở PGURL (mặc định postgres://labflow@localhost:55432/labflow)
import { createHmac, scryptSync, randomBytes } from 'node:crypto';
import pg from 'pg';

const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const p99 = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length * 0.99)]; };
const fmt = (ms) => (ms < 0.001 ? `${(ms * 1e6).toFixed(0)} ns` : ms < 1 ? `${(ms * 1000).toFixed(1)} µs` : `${ms.toFixed(1)} ms`);
const rows = [];
async function measure(name, n, fn) {
  const t = [];
  for (let i = 0; i < n; i++) { const a = performance.now(); await fn(i); t.push(performance.now() - a); }
  rows.push([name, fmt(median(t)), fmt(p99(t))]);
}
const loopSync = (name, n, fn) => {          // việc rất nhanh: đo cả vòng rồi chia (đồng hồ không đủ mịn cho một lần)
  const a = performance.now(); for (let i = 0; i < n; i++) fn(i);
  rows.push([name, fmt((performance.now() - a) / n), '—']);
};

const bookings = Array.from({ length: 10000 }, (_, i) => ({ id: `bk_${i}`, labId: `lab_${i % 3}`, userId: `usr_${i % 500}`,
  startAt: new Date(1798000000000 + i * 3600000).toISOString(), endAt: new Date(1798000000000 + i * 3600000 + 7200000).toISOString(), status: 'PENDING' }));
const byId = new Map(bookings.map((b) => [b.id, b]));

loopSync('Map.get — one booking by id (RAM)', 1_000_000, (i) => byId.get(`bk_${i % 10000}`));
await measure('filter 10,000 bookings in RAM (my bookings)', 200, () => bookings.filter((b) => b.userId === 'usr_7'));
await measure('JSON.stringify 20 bookings', 2000, () => JSON.stringify(bookings.slice(0, 20)));
await measure('HMAC-SHA256 — sign one JWT', 2000, () => createHmac('sha256', 'secret').update('header.payload').digest('base64url'));
const salt = randomBytes(16);
await measure('scrypt — check one password (login)', 30, () => scryptSync('an-lab-2026', salt, 32));
await measure('HTTP over localhost — GET /health (keep-alive)', 300, async () => (await fetch('http://localhost:4000/health')).text());

const db = new pg.Client(process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow');
await db.connect();
await db.query('SELECT 1');
await measure('PostgreSQL over localhost — SELECT by primary key', 300, (i) => db.query('SELECT * FROM bookings WHERE id = $1', [1 + (i * 7919) % 1_000_000]));
await measure('PostgreSQL — OFFSET 900000 LIMIT 20 (Chapter 3)', 5, () => db.query('SELECT id FROM bookings ORDER BY created_at DESC, id DESC LIMIT 20 OFFSET 900000'));
await db.end();

const a = performance.now(); await (await fetch('https://example.com/')).text(); const cold = performance.now() - a;
await measure('Internet — GET https://example.com/ (connection reused)', 10, async () => (await fetch('https://example.com/')).text());
rows.push(['Internet — first request (DNS + TCP + TLS + HTTP)', fmt(cold), '—']);

const w = Math.max(...rows.map((r) => r[0].length));
console.log(`${'operation'.padEnd(w)}  ${'median'.padStart(9)}  ${'p99'.padStart(9)}`);
for (const [n, m, p] of rows) console.log(`${n.padEnd(w)}  ${m.padStart(9)}  ${p.padStart(9)}`);
