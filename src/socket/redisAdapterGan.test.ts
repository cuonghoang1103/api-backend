/**
 * Gắn Redis adapter: không bao giờ gắn MUỘN (13/11/2026) — gắn muộn thay adapter trống ⇒ mọi socket đã nối mất room.
 *   npx tsx --test src/socket/redisAdapterGan.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

function banSao(tre = 0) {
  const c = { loi: 0, dong: 0, on() { c.loi++; return c; }, connect: () => new Promise((r) => setTimeout(r, tre)), quit: async () => { c.dong++; } };
  return c;
}

describe('attachRedisAdapter', () => {
  it('Redis chưa lên trong hạn ⇒ KHÔNG gắn, kể cả khi Redis lên sau đó; bản sao muộn bị đóng', async () => {
    const { attachRedisAdapter } = await import('./messaging.socket.js');
    let goi = 0;
    const sv = { adapter: () => { goi++; } } as never;
    const ban: ReturnType<typeof banSao>[] = [];
    const layRedis = () => new Promise<{ duplicate(): ReturnType<typeof banSao> }>((r) =>
      setTimeout(() => r({ duplicate: () => { const b = banSao(); ban.push(b); return b; } }), 80));
    const ok = await attachRedisAdapter(sv, 20, layRedis as never);
    assert.equal(ok, false);
    await new Promise((r) => setTimeout(r, 150));
    assert.equal(goi, 0, 'không được gắn muộn');
    assert.equal(ban.length, 2);
    assert.ok(ban.every((b) => b.dong === 1), 'bản sao tạo muộn phải được đóng');
  });

  it('Redis sẵn sàng ⇒ gắn adapter, mỗi bản sao có listener error', async () => {
    const { attachRedisAdapter } = await import('./messaging.socket.js');
    let goi = 0;
    const sv = { adapter: () => { goi++; } } as never;
    const ban: ReturnType<typeof banSao>[] = [];
    const ok = await attachRedisAdapter(sv, 1000, (async () => ({ duplicate: () => { const b = banSao(); ban.push(b); return b; } })) as never);
    assert.equal(ok, true);
    assert.equal(goi, 1);
    assert.ok(ban.every((b) => b.loi >= 1));
  });

  it('lấy Redis lỗi ⇒ không gắn, không ném', async () => {
    const { attachRedisAdapter } = await import('./messaging.socket.js');
    const ok = await attachRedisAdapter({ adapter: () => { throw new Error('x'); } } as never, 1000, (async () => { throw new Error('down'); }) as never);
    assert.equal(ok, false);
  });
});
