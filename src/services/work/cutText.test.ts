import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cutText } from './common.js';

test('cutText không xé đôi emoji ở biên', () => {
  const s = 'a'.repeat(469) + '📌' + 'tail';
  const out = cutText(s, 470);
  assert.equal(out, 'a'.repeat(469));
  assert.doesNotThrow(() => Buffer.from(out, 'utf8').toString('utf8'));
  assert.ok(!/[\ud800-\udbff]$/.test(out));
});

test('cutText giữ nguyên chuỗi ngắn và cắt chuỗi thường', () => {
  assert.equal(cutText('xin chào', 50), 'xin chào');
  assert.equal(cutText('abcdef', 3), 'abc');
});
