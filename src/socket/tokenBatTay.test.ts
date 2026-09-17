/**
 * Máy chủ phải đọc được token ở `handshake.auth` — không chỉ ở header.
 *
 * Vì sao: client nào ép `transports: ['websocket']` thì header Authorization
 * KHÔNG BAO GIỜ tới đây (WebSocket API của trình duyệt không cho đặt header,
 * engine.io vứt `extraHeaders` im lặng). App desktop đã nằm đúng nhánh đó và
 * bị từ chối ở mọi lượt nối suốt 16→17/09/2026, không một lỗi nào nổi lên.
 * Chú thích trong `messaging.socket.ts` từng NÓI là nó đọc `auth.token`,
 * nhưng `extractToken()` chưa bao giờ đọc — phép kiểm này khoá lời hứa đó lại.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import type { Socket } from 'socket.io';
import { tokenBatTay } from './messaging.socket.js';

function socketGia(auth: unknown, headers: Record<string, string> = {}): Socket {
  return { handshake: { auth }, request: { headers } } as unknown as Socket;
}

test('đọc token từ handshake.auth', () => {
  assert.equal(tokenBatTay(socketGia({ token: 'tok-1' })), 'tok-1');
});

test('cắt tiền tố Bearer nếu client gửi kèm', () => {
  assert.equal(tokenBatTay(socketGia({ token: 'Bearer tok-2' })), 'tok-2');
});

test('auth ĐỨNG TRƯỚC header — client websocket-only chỉ có auth', () => {
  const s = socketGia({ token: 'tu-auth' }, { authorization: 'Bearer tu-header' });
  assert.equal(tokenBatTay(s), 'tu-auth');
});

test('không có auth thì lùi về header Authorization (đường web)', () => {
  assert.equal(tokenBatTay(socketGia(undefined, { authorization: 'Bearer tu-header' })), 'tu-header');
});

test('không có auth thì lùi về cookie backend_token (đường web, httpOnly)', () => {
  const s = socketGia({}, { cookie: 'foo=1; backend_token=tu-cookie; bar=2' });
  assert.equal(tokenBatTay(s), 'tu-cookie');
});

test('auth rỗng KHÔNG được coi là token', () => {
  assert.equal(tokenBatTay(socketGia({ token: '' })), undefined);
  assert.equal(tokenBatTay(socketGia({ token: 123 })), undefined);
  assert.equal(tokenBatTay(socketGia(undefined)), undefined);
});
