/**
 * Đợt 8D (19/10/2026): mục ghim thanh bên CT Work lưu ở `users.preferences.work.navPins` — kiểm phần lọc (allowlist),
 * gộp theo từng dự án, null = bỏ tuỳ chỉnh, trần số dự án, và bản ghi cũ không bị thêm khoá rỗng.
 *   npx tsx --test src/services/userPreferences.navPins.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { defaultPreferences, mergeNavPins, NAV_PINS_MAX_PROJECTS, sanitize } from './userPreferences.service.js';

describe('work.navPins', () => {
  it('mặc định không có khoá navPins (bản ghi cũ y nguyên)', () => {
    const p = sanitize({ work: { locale: 'vi' } }, defaultPreferences());
    assert.deepEqual(p.work, { locale: 'vi' });
  });

  it('gộp theo dự án, giữ dự án khác', () => {
    const a = sanitize({ work: { navPins: { 12: { pin: ['raid', 'okrs'], hide: ['timeline'] } } } }, defaultPreferences());
    const b = sanitize({ work: { navPins: { 13: { pin: ['chat'] } } } }, a);
    assert.deepEqual(b.work.navPins, { 12: { pin: ['raid', 'okrs'], hide: ['timeline'] }, 13: { pin: ['chat'], hide: [] } });
    assert.equal(b.work.locale, null);
  });

  it('null = bỏ tuỳ chỉnh; hết dự án ⇒ xoá luôn khoá', () => {
    const a = sanitize({ work: { navPins: { 7: { pin: ['raid'], hide: [] } } } }, defaultPreferences());
    const b = sanitize({ work: { navPins: { 7: null } } }, a);
    assert.equal('navPins' in b.work, false);
  });

  it('lọc khoá lạ, đường dẫn lạ, trùng, quá dài', () => {
    const np = mergeNavPins(undefined, {
      __proto__: { pin: ['x'] }, abc: { pin: ['board'] }, '-1': { pin: ['board'] },
      5: { pin: ['board', 'board', '../x', 'A', 'x'.repeat(40), 42, 'release-notes'], hide: 'docs', evil: 'y'.repeat(9000) },
    });
    assert.deepEqual(np, { 5: { pin: ['board', 'release-notes'], hide: [] } });
    assert.equal(mergeNavPins(undefined, ['board']), undefined);
    assert.equal(mergeNavPins(undefined, 'board'), undefined);
  });

  it('mỗi dự án tối đa 40 mục; tối đa NAV_PINS_MAX_PROJECTS dự án (bỏ id nhỏ nhất, giữ dự án vừa ghi)', () => {
    const many = Array.from({ length: 80 }, (_, i) => `m${i}`);
    assert.equal(mergeNavPins(undefined, { 1: { pin: many } })!['1'].pin.length, 40);
    let cur: ReturnType<typeof mergeNavPins>;
    for (let i = 1; i <= NAV_PINS_MAX_PROJECTS + 5; i++) cur = mergeNavPins(cur, { [i]: { pin: ['raid'] } });
    assert.equal(Object.keys(cur!).length, NAV_PINS_MAX_PROJECTS);
    assert.equal(cur!['1'], undefined);
    cur = mergeNavPins(cur, { 2: { pin: ['okrs'] } });
    assert.equal(Object.keys(cur!).length, NAV_PINS_MAX_PROJECTS);
    assert.deepEqual(cur!['2'], { pin: ['okrs'], hide: [] });
  });

  it('đọc lại bản đã lưu qua sanitize(stored, defaults) giữ nguyên', () => {
    const stored = sanitize({ work: { locale: 'en', navPins: { 3: { pin: ['raid'], hide: ['docs'] } } } }, defaultPreferences());
    const again = sanitize(JSON.parse(JSON.stringify(stored)), defaultPreferences());
    assert.deepEqual(again.work, stored.work);
  });
});
