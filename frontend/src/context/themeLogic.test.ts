/**
 * Chế độ màu Sáng / Tối / Tự động (18/10/2026). Chạy từ gốc repo:
 *   npx tsx --test frontend/src/context/themeLogic.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  DEFAULT_THEME_PREFERENCE,
  THEME_BOOT_SCRIPT,
  parseThemePreference,
  resolveTheme,
  serverThemeFor,
  shouldApplyServerTheme,
  themeClassFor,
  toggledPreference,
  type ThemePreference,
} from './themeLogic';

describe('lựa chọn ⇒ kết quả', () => {
  it('giá trị cũ dark/light vẫn chạy y như trước', () => {
    assert.equal(parseThemePreference('dark'), 'dark');
    assert.equal(parseThemePreference('light'), 'light');
    assert.equal(resolveTheme('dark', false), 'dark');
    assert.equal(resolveTheme('light', true), 'light');
  });
  it('chưa chọn / giá trị lạ ⇒ mặc định tối (giữ hành vi cũ)', () => {
    assert.equal(DEFAULT_THEME_PREFERENCE, 'dark');
    for (const raw of [null, undefined, '', 'auto', 'DARK', 1]) assert.equal(parseThemePreference(raw), 'dark');
  });
  it("'system' theo hệ điều hành và đổi khi hệ điều hành đổi", () => {
    assert.equal(parseThemePreference('system'), 'system');
    assert.equal(resolveTheme('system', true), 'dark');
    assert.equal(resolveTheme('system', false), 'light');
  });
  it('class trên <html> là theme-dark, KHÔNG BAO GIỜ .dark', () => {
    assert.equal(themeClassFor('dark'), 'theme-dark');
    assert.equal(themeClassFor('light'), 'light');
  });
  it('nút đảo cũ: đảo cái đang hiện, chốt thành lựa chọn tường minh', () => {
    assert.equal(toggledPreference(resolveTheme('system', true)), 'light');
    assert.equal(toggledPreference('light'), 'dark');
  });
});

describe('đồng bộ máy chủ (chỉ nhận dark/light)', () => {
  it("'system' không bao giờ gửi lên máy chủ", () => {
    assert.equal(serverThemeFor('system'), null);
    assert.equal(serverThemeFor('dark'), 'dark');
    assert.equal(serverThemeFor('light'), 'light');
  });
  it("máy chủ không đè 'system' của máy này", () => {
    assert.equal(shouldApplyServerTheme('system', 'dark'), false);
    assert.equal(shouldApplyServerTheme('system', 'light'), false);
  });
  it('máy chủ đè khi khác, bỏ qua khi giống hoặc giá trị lạ', () => {
    assert.equal(shouldApplyServerTheme('dark', 'light'), true);
    assert.equal(shouldApplyServerTheme('light', 'dark'), true);
    assert.equal(shouldApplyServerTheme('dark', 'dark'), false);
    assert.equal(shouldApplyServerTheme('dark', 'system'), false);
    assert.equal(shouldApplyServerTheme('dark', undefined), false);
  });
});

/** Chạy CHÍNH chuỗi script chống nháy trên một DOM giả. */
function runBoot(stored: string | null, systemDark: boolean | null, storageThrows = false) {
  const classes = new Set<string>();
  const attrs: Record<string, string> = {};
  const documentElement = {
    classList: { add: (c: string) => { classes.add(c); } },
    setAttribute: (k: string, v: string) => { attrs[k] = v; },
  };
  const localStorage = {
    getItem: (k: string) => { if (storageThrows) throw new Error('blocked'); return k === 'theme' ? stored : null; },
  };
  const window = systemDark === null ? {} : { matchMedia: (q: string) => ({ matches: q === '(prefers-color-scheme: dark)' ? systemDark : !systemDark }) };
  new Function('document', 'localStorage', 'window', THEME_BOOT_SCRIPT)({ documentElement }, localStorage, window);
  return { classes: [...classes], pref: attrs['data-theme-pref'] };
}

describe('script chống nháy khớp lõi thuần', () => {
  const cases: Array<[string | null, boolean]> = [];
  for (const s of [null, 'dark', 'light', 'system', 'rác']) for (const d of [true, false]) cases.push([s, d]);
  for (const [stored, sysDark] of cases) {
    it(`theme=${String(stored)} · hệ điều hành ${sysDark ? 'tối' : 'sáng'}`, () => {
      const pref: ThemePreference = parseThemePreference(stored);
      const out = runBoot(stored, sysDark);
      assert.deepEqual(out.classes, [themeClassFor(resolveTheme(pref, sysDark))]);
      assert.equal(out.pref, pref);
      assert.ok(!(out.classes as string[]).includes('dark'));
    });
  }
  it('trình duyệt không có matchMedia + system ⇒ không nổ, ra sáng', () => {
    assert.deepEqual(runBoot('system', null).classes, ['light']);
  });
  it('localStorage bị chặn ⇒ tối', () => {
    assert.deepEqual(runBoot('light', true, true).classes, ['theme-dark']);
  });
});
