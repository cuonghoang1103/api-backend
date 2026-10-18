/**
 * Link trong câu trả lời AI: `/work/…` (và URL tuyệt đối cùng origin) mở trong app; còn lại để link thường (tab mới).
 *   npx tsx --test frontend/src/components/work/ai/links.test.ts
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { inAppPath, isModifiedClick } from './links';

test('đường CT Work tương đối ⇒ giữ nguyên', () => {
  assert.equal(inAppPath('/work/nhom-3/NT/issue/4', 'https://cuongthai.com'), '/work/nhom-3/NT/issue/4');
  assert.equal(inAppPath('/work/nhom-3/NT/docs/1#4-quy-uoc-git', null), '/work/nhom-3/NT/docs/1#4-quy-uoc-git');
});

test('URL tuyệt đối CÙNG origin ⇒ đường trong app; origin khác / ngoài /work ⇒ null', () => {
  assert.equal(inAppPath('https://cuongthai.com/work/nhom-3/NT/resources?x=1', 'https://cuongthai.com'), '/work/nhom-3/NT/resources?x=1');
  assert.equal(inAppPath('https://evil.example/work/nhom-3/NT/issue/4', 'https://cuongthai.com'), null);
  assert.equal(inAppPath('https://cuongthai.com/blog/x', 'https://cuongthai.com'), null);
  assert.equal(inAppPath('https://www.figma.com/design/AbC', 'https://cuongthai.com'), null);
  assert.equal(inAppPath('', 'https://cuongthai.com'), null);
  assert.equal(inAppPath(undefined, 'https://cuongthai.com'), null);
  assert.equal(inAppPath('/workspace-khac', 'https://cuongthai.com'), null, 'không nhận tiền tố /work không có dấu /');
});

test('cú bấm có phím bổ trợ / chuột giữa ⇒ để trình duyệt tự mở tab', () => {
  const base = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false };
  assert.equal(isModifiedClick(base), false);
  assert.equal(isModifiedClick({ ...base, metaKey: true }), true);
  assert.equal(isModifiedClick({ ...base, button: 1 }), true);
});
