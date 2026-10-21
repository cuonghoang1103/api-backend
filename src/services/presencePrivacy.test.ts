/**
 * Luật trạng thái hoạt động (presencePrivacy.ts) + phát socket không bao giờ toàn cục — không cần DB.
 *   npx tsx --test src/services/presencePrivacy.test.ts
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

import { presenceFor, hoatDongGanDay, type PresenceViewer } from './presencePrivacy.js';

const NOW = new Date('2026-10-21T12:00:00Z');
const vuaXong = new Date(NOW.getTime() - 10_000);
const lauRoi = new Date(NOW.getTime() - 10 * 60_000);

function viewer(over: Partial<PresenceViewer> = {}): PresenceViewer {
  return { viewerId: 1, viewerShows: true, blocked: new Set(), circle: new Set([2]), ...over };
}
const ban = { id: 2, showActiveStatus: true, lastActiveAt: vuaXong };

describe('presenceFor — một luật cho mọi chỗ', () => {
  it('bạn bè bật công tắc, vừa hoạt động ⇒ thấy online + mốc', () => {
    assert.deepEqual(presenceFor(viewer(), ban, { now: NOW }), { visible: true, isOnline: true, lastActiveAt: vuaXong });
  });
  it('mốc cũ ⇒ thấy mốc nhưng không online; đang nối socket ⇒ online', () => {
    const p = presenceFor(viewer(), { ...ban, lastActiveAt: lauRoi }, { now: NOW });
    assert.deepEqual([p.visible, p.isOnline, p.lastActiveAt], [true, false, lauRoi]);
    assert.equal(presenceFor(viewer(), { ...ban, lastActiveAt: lauRoi }, { now: NOW, connected: true }).isOnline, true);
  });
  it('khách chưa đăng nhập ⇒ ẩn', () => {
    assert.deepEqual(presenceFor(null, ban, { now: NOW }), { visible: false, isOnline: false, lastActiveAt: null });
  });
  it('người được xem TẮT công tắc ⇒ ẩn; thiếu cờ ⇒ ẩn (fail-closed)', () => {
    assert.equal(presenceFor(viewer(), { ...ban, showActiveStatus: false }, { now: NOW }).visible, false);
    assert.equal(presenceFor(viewer(), { id: 2, lastActiveAt: vuaXong }, { now: NOW }).visible, false);
    assert.equal(presenceFor(viewer(), { ...ban, showActiveStatus: false }, { now: NOW }).lastActiveAt, null);
  });
  it('người XEM tắt công tắc ⇒ không thấy ai (đối ứng)', () => {
    assert.deepEqual(presenceFor(viewer({ viewerShows: false }), ban, { now: NOW }), { visible: false, isOnline: false, lastActiveAt: null });
  });
  it('chặn (bất kỳ chiều — tập blocked gộp cả hai) ⇒ ẩn', () => {
    assert.equal(presenceFor(viewer({ blocked: new Set([2]) }), ban, { now: NOW }).visible, false);
  });
  it('người lạ (không bạn bè / không nhắn nhau / không cùng không gian) ⇒ ẩn; circle=null (người cùng cuộc trò chuyện) ⇒ thấy', () => {
    assert.equal(presenceFor(viewer({ circle: new Set() }), ban, { now: NOW }).visible, false);
    assert.equal(presenceFor(viewer({ circle: null }), ban, { now: NOW }).visible, true);
  });
  it('AI agent ⇒ ẩn', () => {
    assert.equal(presenceFor(viewer(), { ...ban, kind: 'AGENT' }, { now: NOW }).visible, false);
  });
  it('xem chính mình ⇒ luôn thấy, kể cả khi tắt công tắc', () => {
    const p = presenceFor(viewer({ viewerShows: false }), { id: 1, showActiveStatus: false, lastActiveAt: vuaXong }, { now: NOW });
    assert.deepEqual([p.visible, p.isOnline], [true, true]);
  });
  it('ngưỡng online 60 s', () => {
    assert.equal(hoatDongGanDay(new Date(NOW.getTime() - 59_000), NOW), true);
    assert.equal(hoatDongGanDay(new Date(NOW.getTime() - 61_000), NOW), false);
    assert.equal(hoatDongGanDay(null, NOW), false);
  });
});

describe('socket presence — không bao giờ phát toàn cục', () => {
  function fakeIo() {
    const sent: Array<{ room: string; ev: string; payload: any }> = [];
    return {
      sent,
      to(room: string) { return { emit(ev: string, payload: unknown) { sent.push({ room, ev, payload }); return true; } }; },
    };
  }

  it('chỉ phát tới audience ĐÃ LỌC (bỏ người chặn / người tắt)', async () => {
    const { phatTrangThaiKhiNoi } = await import('../socket/messaging.socket.js');
    const io = fakeIo();
    const loc = async (_u: number, ids: number[]) => ids.filter((id) => id !== 7); // 7 = người đã chặn
    const audience = await phatTrangThaiKhiNoi({ userId: 1, ungVien: [2, 7], hienTrangThai: true, vuaOnline: true }, io, loc);
    assert.deepEqual(audience, [2]);
    assert.deepEqual(io.sent.map((s) => s.room), ['user:2']);
    assert.equal(io.sent[0].ev, 'presence:update');
    assert.equal(io.sent[0].payload.userId, 1);
  });

  it('lọc lỗi ⇒ KHÔNG phát gì (trước đây rơi về broadcast toàn cục)', async () => {
    const { phatTrangThaiKhiNoi } = await import('../socket/messaging.socket.js');
    const io = fakeIo();
    const audience = await phatTrangThaiKhiNoi(
      { userId: 1, ungVien: [2, 3], hienTrangThai: true, vuaOnline: true },
      io,
      async () => { throw new Error('db down'); },
    );
    assert.equal(audience, undefined);
    assert.equal(io.sent.length, 0);
  });

  it('người tắt trạng thái ⇒ không phát "đã online"', async () => {
    const { phatTrangThaiKhiNoi } = await import('../socket/messaging.socket.js');
    const io = fakeIo();
    await phatTrangThaiKhiNoi({ userId: 1, ungVien: [2], hienTrangThai: false, vuaOnline: true }, io, async (_u, ids) => ids);
    assert.equal(io.sent.length, 0);
  });

  it('mã nguồn socket không còn đường phát presence toàn cục', () => {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const src = readFileSync(path.join(here, '../socket/messaging.socket.ts'), 'utf8');
    assert.doesNotMatch(src, /io\??\.emit\(\s*'presence:update'/);
    assert.doesNotMatch(src, /broadcast\.emit\(\s*'presence:update'/);
  });
});
