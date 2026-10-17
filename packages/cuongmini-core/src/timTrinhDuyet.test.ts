/** Dò trình duyệt có sẵn: đủ ba hệ điều hành, Chrome trước, env ép được. */
import assert from 'node:assert/strict';
import test from 'node:test';

import { timTrinhDuyet, ungVienTrinhDuyet } from './timTrinhDuyet';

test('macOS: Chrome đứng đầu, có Edge/Brave/Chromium, cả ~/Applications', () => {
  const ds = ungVienTrinhDuyet('darwin');
  assert.equal(ds[0], '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
  for (const t of ['Microsoft Edge', 'Brave Browser', 'Chromium']) assert.ok(ds.some((p) => p.includes(`${t}.app`)), t);
  assert.ok(ds.some((p) => p.includes('/Applications/') && !p.startsWith('/Applications/')));
});

test('Windows: Program Files, (x86) và LOCALAPPDATA — Edge có sẵn trên mọi máy Windows', () => {
  const ds = ungVienTrinhDuyet('win32', { PROGRAMFILES: 'C:\\Program Files', 'PROGRAMFILES(X86)': 'C:\\Program Files (x86)', LOCALAPPDATA: 'C:\\Users\\a\\AppData\\Local' });
  assert.ok(ds.includes('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'));
  assert.ok(ds.includes('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'));
  assert.ok(ds.includes('C:\\Users\\a\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'));
});

test('Linux: dò theo PATH và các tên gói phổ biến', () => {
  const ds = ungVienTrinhDuyet('linux', { PATH: '/x/bin' });
  assert.ok(ds.includes('/x/bin/google-chrome-stable'));
  assert.ok(ds.includes('/usr/bin/chromium-browser'));
  assert.ok(ds.includes('/snap/bin/chromium'));
});

test('CUONGMINI_TRINH_DUYET trỏ tới file không có ⇒ null (không lặng lẽ dùng cái khác)', () => {
  const cu = process.env.CUONGMINI_TRINH_DUYET;
  process.env.CUONGMINI_TRINH_DUYET = '/khong/co/chrome';
  try { assert.equal(timTrinhDuyet(), null); } finally {
    if (cu === undefined) delete process.env.CUONGMINI_TRINH_DUYET; else process.env.CUONGMINI_TRINH_DUYET = cu;
  }
});
