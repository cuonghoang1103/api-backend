/**
 * QA đợt 7 (19/10/2026) — hồ sơ trình duyệt AI KHÔNG BAO GIỜ là hồ sơ chính của người dùng: env trỏ vào kênh Beta/Dev/
 * Canary, Edge/Brave/Vivaldi/Opera/Arc, ".../User Data" của Windows, hoặc một SYMLINK trỏ vào hồ sơ Chrome ⇒ bỏ qua.
 */
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { hoSoAnToan, thuMucHoSo } from './trinhDuyetThay';

test('hoSoAnToan: mọi hồ sơ chính của trình duyệt nhân Chromium bị từ chối; hồ sơ riêng thì qua', () => {
  const h = os.homedir();
  const cam = [
    path.join(h, 'Library/Application Support/Google/Chrome'),
    path.join(h, 'Library/Application Support/Google/Chrome Beta'),
    path.join(h, 'Library/Application Support/Google/Chrome Canary/Default'),
    path.join(h, 'Library/Application Support/Microsoft Edge Dev'),
    path.join(h, 'Library/Application Support/BraveSoftware/Brave-Browser'),
    path.join(h, 'Library/Application Support/Vivaldi'),
    path.join(h, 'Library/Application Support/com.operasoftware.Opera'),
    path.join(h, 'Library/Application Support/Arc/User Data'),
    path.join(h, 'Library/Application Support/Chromium'),
    'C:\\Users\\a\\AppData\\Local\\Google\\Chrome\\User Data',
    'C:\\Users\\a\\AppData\\Local\\Microsoft\\Edge SxS\\User Data',
    'C:\\Users\\a\\AppData\\Roaming\\Opera Software\\Opera Stable',
    path.join(h, '.config/google-chrome-beta'),
    path.join(h, '.config/google-chrome-unstable'),
    path.join(h, '.config/microsoft-edge-dev'),
    path.join(h, 'snap/chromium/common/chromium'),
  ];
  for (const d of cam) assert.equal(hoSoAnToan(d), false, d);
  for (const d of [path.join(h, '.cuongmini', 'trinh-duyet'), path.join(h, 'ho-so-ai'), '/tmp/cm-test/profile', path.join(h, 'projects/chrome-extension-demo')]) {
    assert.equal(hoSoAnToan(d), true, d);
  }
});

test('hoSoAnToan: symlink trông vô hại nhưng trỏ vào hồ sơ Chrome ⇒ từ chối; thuMucHoSo lùi về hồ sơ riêng', () => {
  const tam = mkdtempSync(path.join(os.tmpdir(), 'cm-qa70-hs-'));
  const that = path.join(tam, 'Google', 'Chrome');
  mkdirSync(that, { recursive: true });
  const lienKet = path.join(tam, 'ho-so-ai');
  symlinkSync(that, lienKet);
  const cu = process.env.CUONGMINI_HO_SO_TRINH_DUYET;
  try {
    assert.equal(hoSoAnToan(lienKet), false);
    process.env.CUONGMINI_HO_SO_TRINH_DUYET = lienKet;
    assert.equal(thuMucHoSo(), path.join(os.homedir(), '.cuongmini', 'trinh-duyet'));
  } finally {
    if (cu === undefined) delete process.env.CUONGMINI_HO_SO_TRINH_DUYET; else process.env.CUONGMINI_HO_SO_TRINH_DUYET = cu;
    rmSync(tam, { recursive: true, force: true });
  }
});
