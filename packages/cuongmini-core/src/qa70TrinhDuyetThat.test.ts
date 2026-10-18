/**
 * QA đợt 7 (19/10/2026) — trình duyệt THẬT, chạy NGẦM (headless), hồ sơ tạm. Chỉ chạy khi đặt
 * `CUONGMINI_TEST_TRINH_DUYET_THAT=1` và máy có Chrome/Edge/Brave/Chromium:
 *   CUONGMINI_TEST_TRINH_DUYET_THAT=1 npx tsx --test packages/cuongmini-core/src/qa70TrinhDuyetThat.test.ts
 *
 *   • bật ngầm (headless) đúng hồ sơ tạm, viewport 1280×800, đọc + chụp một trang localhost, tắt sạch (không còn tiến trình);
 *   • `goChu` từ chối mọi kiểu ô mật khẩu: type=password (tìm bằng selector khác), ô ĐỔI type khi focus, ô che chữ bằng
 *     CSS `-webkit-text-security`, ô `autocomplete=current-password|one-time-code`, ô tên/nhãn "mật khẩu"; ô thường (kể cả "passport") vẫn gõ được.
 */
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import * as td from './trinhDuyetThay';
import { timTrinhDuyet } from './timTrinhDuyet';

const BAT = process.env.CUONGMINI_TEST_TRINH_DUYET_THAT === '1' && !!timTrinhDuyet();

const TRANG = `<!doctype html><html><head><title>QA70</title></head><body>
<h1>Trang thử QA70</h1>
<input id="ten" name="ten" type="text">
<input id="pw" name="matkhau" type="password">
<input id="doi" type="text" onfocus="this.type='password'">
<input id="css" type="text" style="-webkit-text-security: disc">
<input id="ac" type="text" autocomplete="current-password">
<input id="otp" type="text" autocomplete="one-time-code">
<input id="vi" type="text" placeholder="Mật khẩu">
<input id="hochieu" name="passport" type="text">
<textarea id="ghi"></textarea>
</body></html>`;

test('trình duyệt THẬT chạy ngầm: hồ sơ riêng, viewport cố định, không gõ ô mật khẩu, tắt sạch', { skip: !BAT && 'đặt CUONGMINI_TEST_TRINH_DUYET_THAT=1 (cần Chrome)' }, async () => {
  const tam = mkdtempSync(path.join(os.tmpdir(), 'cm-qa70-'));
  const hoSo = path.join(tam, 'ho-so');
  process.env.CUONGMINI_HO_SO_TRINH_DUYET = hoSo;
  delete process.env.CUONGMINI_TRINH_DUYET_CHE_DO;
  const may = createServer((_q, r) => { r.setHeader('content-type', 'text/html; charset=utf-8'); r.end(TRANG); });
  await new Promise<void>((ok) => { may.listen(0, '127.0.0.1', ok); });
  const url = `http://127.0.0.1:${(may.address() as AddressInfo).port}/`;
  try {
    assert.equal(td.cheDoHienTai(), 'ngam', 'mặc định NGẦM');
    assert.equal(td.thuMucHoSo(), hoSo);
    const t0 = Date.now();
    td.mo(null, null, url); // đúng đường `web_mo` của tools.ts
    for (let i = 0; i < 80 && !(td.dangMo() && td.urlHienTai().startsWith(url)); i++) await new Promise((ok) => { setTimeout(ok, 250); });
    assert.equal(td.dangMo(), true, 'đã bật được trình duyệt');
    await td.choTai(10_000);
    assert.match(await td.docTrang(), /Trang thử QA70/);

    /* Tiến trình trình duyệt dùng ĐÚNG hồ sơ tạm và chạy headless. */
    const ps = execSync('ps -axo args', { encoding: 'utf8' }).split('\n').filter((l) => l.includes(hoSo));
    assert.ok(ps.length > 0, 'có tiến trình dùng hồ sơ tạm');
    assert.ok(ps.some((l) => /--headless/.test(l)), `chạy headless: ${ps[0]?.slice(0, 200)}`);

    const anh = await td.chupTrang();
    assert.ok(anh, 'chụp được');
    const png = Buffer.from(anh!.data, 'base64');
    if (anh!.kieu === 'image/png') {
      assert.equal(png.readUInt32BE(16), 1280, 'rộng 1280');
      assert.equal(png.readUInt32BE(20), 800, 'cao 800');
    }

    assert.deepEqual(await td.goChu('#ten', 'an'), { ok: true }, 'ô thường gõ được');
    assert.deepEqual(await td.goChu('#ghi', 'ghi chú'), { ok: true }, 'textarea gõ được');
    assert.deepEqual(await td.goChu('#hochieu', 'B1234567'), { ok: true }, '"passport" không phải mật khẩu');
    for (const sel of ['#pw', 'input[name=matkhau]', '#doi', '#css', '#ac', '#otp', '#vi']) {
      const kq = await td.goChu(sel, 'mat-khau-gia-lap');
      assert.equal(kq.ok, false, `${sel} phải bị từ chối`);
      assert.match(kq.loi ?? '', /MẬT KHẨU/, sel);
    }
    console.log(`  (bật + đọc + chụp + 10 phép gõ: ${Date.now() - t0} ms)`);
  } finally {
    await td.huy();
    may.close();
    await new Promise((ok) => { setTimeout(ok, 1500); });
    const conLai = execSync('ps -axo args', { encoding: 'utf8' }).split('\n').filter((l) => l.includes(hoSo) && !l.includes('ps -axo'));
    rmSync(tam, { recursive: true, force: true });
    assert.deepEqual(conLai, [], 'tắt sạch: không còn tiến trình trình duyệt');
  }
});
