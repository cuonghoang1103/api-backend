/**
 * Kiểm phía client của tệp đính kèm Messenger (lỗi 13/11/2026: Windows để `file.type` RỖNG cho .md/.rar ⇒
 * bị từ chối "định dạng không được hỗ trợ"). Chạy: npx tsx --test frontend/src/lib/tinNhan/tepDinhKem.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { duoiTep, kiemTepGui, TRAN_CO_TEP } from './tepDinhKem';

describe('kiemTepGui', () => {
  it('nhận .md/.zip/.rar/.7z/.pptx/mã nguồn/đuôi lạ — không nhìn MIME', () => {
    for (const name of ['ghi-chu.md', 'code.zip', 'code.rar', 'a.7z', 'slide.pptx', 'Main.java', 'pom.xml', 'du-lieu.bin', 'README']) {
      assert.deepEqual(kiemTepGui({ name, size: 10 }), { ok: true }, name);
    }
  });

  it('chặn tệp chạy được, kể cả đuôi kép và dấu chấm cuối kiểu Windows', () => {
    for (const name of ['setup.exe', 'SETUP.EXE', 'run.bat', 'x.cmd', 'x.ps1', 'x.vbs', 'x.js', 'x.msi', 'bao-cao.pdf.exe', 'virus.exe.', 'x.lnk']) {
      assert.equal(kiemTepGui({ name, size: 10 }).ok, false, name);
    }
  });

  it('cỡ: rỗng và quá trần bị chặn', () => {
    assert.equal(kiemTepGui({ name: 'a.md', size: 0 }).ok, false);
    assert.equal(kiemTepGui({ name: 'a.zip', size: TRAN_CO_TEP + 1 }).ok, false);
    assert.equal(kiemTepGui({ name: 'a.zip', size: TRAN_CO_TEP }).ok, true);
  });

  it('duoiTep', () => {
    assert.equal(duoiTep('a.PDF'), 'pdf');
    assert.equal(duoiTep('a.exe. . '), 'exe');
    assert.equal(duoiTep('.bashrc'), '');
    assert.equal(duoiTep('README'), '');
  });
});
