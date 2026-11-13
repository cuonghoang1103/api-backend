/**
 * `khiKhachDong` — huỷ việc khi khách đóng SSE giữa chừng (13/11/2026).
 *   npx tsx --test src/utils/khachDong.test.ts
 *
 * Dựng đúng hình dạng `/agent/turn`: `express.json()` + middleware `await` trước handler, handler mở SSE rồi chạy lâu.
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import test from 'node:test';
import express from 'express';

import { khiKhachDong } from './khachDong.js';

async function dung(): Promise<{ base: string; dong: () => void; log: string[] }> {
  const app = express();
  app.use(express.json());
  const log: string[] = [];
  /* Middleware bất đồng bộ như `authenticate` / `chiProHoacNhomHoacFree` (gọi CSDL). */
  app.use(async (_req, _res, next) => { await new Promise((r) => setTimeout(r, 20)); next(); });
  app.post('/sse', (req, res) => {
    req.on('close', () => log.push('req-close')); // cách CŨ — để đối chứng
    khiKhachDong(res, () => log.push('khach-dong'));
    res.setHeader('Content-Type', 'text/event-stream');
    res.flushHeaders();
    const iv = setInterval(() => { if (!res.writableEnded) res.write('data: x\n\n'); }, 30);
    setTimeout(() => { clearInterval(iv); if (!res.writableEnded) res.end(); }, Number(req.body?.ms ?? 400));
  });
  const srv = app.listen(0);
  const base = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`;
  return { base, dong: () => srv.close(), log };
}

const cho = (ms: number) => new Promise((r) => setTimeout(r, ms));

test('khách huỷ giữa luồng ⇒ khiKhachDong bắn (req.on("close") thì KHÔNG — lỗi cũ của /agent/turn)', async () => {
  const s = await dung();
  try {
    const ac = new AbortController();
    const r = await fetch(`${s.base}/sse`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ms: 1500 }), signal: ac.signal });
    await r.body!.getReader().read();
    ac.abort();
    await cho(300);
    assert.deepEqual(s.log.filter((x) => x === 'khach-dong'), ['khach-dong']);
    assert.ok(!s.log.includes('req-close'), 'đối chứng: req "close" đã bắn trước khi handler gắn listener nên không bao giờ tới');
  } finally { s.dong(); }
});

test('ta tự res.end() ⇒ KHÔNG coi là khách đóng', async () => {
  const s = await dung();
  try {
    const r = await fetch(`${s.base}/sse`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ms: 100 }) });
    await r.text();
    await cho(100);
    assert.ok(!s.log.includes('khach-dong'), JSON.stringify(s.log));
  } finally { s.dong(); }
});
