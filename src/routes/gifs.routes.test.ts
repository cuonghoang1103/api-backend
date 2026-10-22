/**
 * Proxy GIF — phân trang `offset` (22/10/2026). Hàm thuần, không gọi GIPHY thật.
 * Chạy: npx tsx --test src/routes/gifs.routes.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGifOffset, giphyUrl, GIF_PAGE_SIZE, GIF_MAX_OFFSET } from './gifs.routes.js';

test('parseGifOffset: rác/âm/thiếu ⇒ 0', () => {
  for (const v of [undefined, '', 'abc', '-24', -5, null, {}, 'NaN']) assert.equal(parseGifOffset(v), 0);
});

test('parseGifOffset: làm tròn xuống bội của trang', () => {
  assert.equal(parseGifOffset('24'), 24);
  assert.equal(parseGifOffset('48'), 48);
  assert.equal(parseGifOffset('50'), 48);
  assert.equal(parseGifOffset(23), 0);
});

test('parseGifOffset: trần theo giới hạn GIPHY', () => {
  const v = parseGifOffset('999999');
  assert.ok(v <= GIF_MAX_OFFSET);
  assert.equal(v % GIF_PAGE_SIZE, 0);
});

test('giphyUrl: trending khi q rỗng, search mã hoá q, luôn kèm limit + offset', () => {
  const t = giphyUrl('K', '', 0);
  assert.match(t, /\/trending\?api_key=K&limit=24&offset=0&rating=pg$/);
  const s = giphyUrl('K', 'chào bạn', 48);
  assert.match(s, /\/search\?api_key=K&q=ch%C3%A0o%20b%E1%BA%A1n&limit=24&offset=48&rating=pg$/);
});
