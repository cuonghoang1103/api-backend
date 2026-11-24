/**
 * 24/11/2026 — Pro 2 / Max / Fable Max chạy qua cổng Claude rẻ (gwai) khi chính hãng không có key.
 *   npx tsx --test src/services/agent/gwaiDoi.test.ts
 * Thuần: bảng model (bản sao gwai, đích tự chuyển), danh sách cho app (dungDuoc / lý do CHỈ admin), map model gwai.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

process.env.STORAGE_SANDBOX ??= '1';
delete process.env.GWAI_BASE_URL;
delete process.env.GWAI_API_KEY;
delete process.env.GWAI_MODEL_FABLE;

const B = await import('./bangModel.js');
const D = await import('./anthropicChinhHang/dinhTuyen.js');

const ADMIN = { laAdmin: true, modelCao: true, invisible: true };
const NGUOI_CO_VE = { laAdmin: false, modelCao: true, invisible: true };
const NGUOI_KHONG_VE = { laAdmin: false, modelCao: false, invisible: false };

describe('bản sao gwai trong bảng model', () => {
  it('ba model trả phí có bản sao gwai ẩn, cùng khoá, trỏ về gốc', () => {
    for (const [goc, sao] of [['cm-sonic', 'cm-sonic-g'], ['cm-optimum', 'cm-optimum-g'], ['cm-invisible', 'cm-invisible-g']] as const) {
      const g = B.mucTheoId(goc)!;
      const s = B.mucTheoId(sao)!;
      assert.equal(g.quaGwai, sao);
      assert.equal(s.an, true);
      assert.equal(s.gwaiDoi, true);
      assert.equal(s.cong, 'rambo');
      assert.equal(s.khoa, g.khoa, `${sao} cùng loại khoá với ${goc}`);
      assert.equal(s.ten, g.ten, 'cùng tên hiển thị');
      assert.equal(B.mucGocCua(s).id, goc);
    }
    assert.equal(B.mucGocCua(B.mucTheoId('cm-sonic')!).id, 'cm-sonic');
  });

  it('bản sao không lọt ra danh sách app, không thành mục Classic, không chọn được bằng mã từ app', () => {
    const ids = B.bangModel().map((m) => m.id);
    for (const sao of ['cm-sonic-g', 'cm-optimum-g', 'cm-invisible-g']) {
      assert.ok(!ids.includes(sao));
      assert.equal(B.chuanHoaMaTuApp(sao), B.MA_DEFAULT);
    }
    assert.ok(B.bangClassic().every((m) => !m.gwaiDoi));
  });

  it('timModel giữ bản sao gwai kể cả khi công tắc rambo toàn cục tắt', () => {
    assert.equal(B.timModel('cm-optimum-g').id, 'cm-optimum-g');
  });

  it('đích tự chuyển: chính hãng → gwai (khi gwai chạy) → cm-solid; không gwai ⇒ thẳng cm-solid', () => {
    const max = B.mucTheoId('cm-optimum')!;
    assert.equal(B.tuongDuongCho(max, true)?.id, 'cm-optimum-g');
    assert.equal(B.tuongDuongCho(max, false)?.id, 'cm-solid');
    assert.equal(B.tuongDuongCho(B.mucTheoId('cm-optimum-g')!, true)?.id, 'cm-solid');
    /* Mặc định (Haiku) không có bản sao ⇒ y như cũ. */
    assert.equal(B.tuongDuongCho(B.mucTheoId(B.MA_DEFAULT)!, true)?.id, 'cm-solid');
  });

  it('model thật gửi gwai: opus 5.5; fable theo danh sách gwai (5-2 → 5-1 → 5, không có ⇒ opus)', () => {
    assert.equal(B.gwaiModelCho('opus', []), 'claude-opus-5-5');
    assert.equal(B.gwaiModelCho('fable', undefined), 'claude-fable-5');
    assert.equal(B.gwaiModelCho('fable', ['claude-fable-5', 'claude-fable-5-2']), 'claude-fable-5-2');
    assert.equal(B.gwaiModelCho('fable', ['claude-fable-5-1', 'claude-opus-5-5']), 'claude-fable-5-1');
    assert.equal(B.gwaiModelCho('fable', ['claude-opus-5-5', 'claude-sonnet-5']), 'claude-opus-5-5');
    process.env.GWAI_MODEL_FABLE = 'claude-fable-x';
    try { assert.equal(B.gwaiModelCho('fable', ['claude-fable-5']), 'claude-fable-x'); } finally { delete process.env.GWAI_MODEL_FABLE; }
  });
});

describe('danh sách model cho app', () => {
  const lay = (ds: ReturnType<typeof D.dsModelChoAppThuan>, id: string) => ds.find((m) => m.id === id)!;

  it('chính hãng KHÔNG có key nhưng gwai chạy ⇒ Pro 2 / Max / Fable Max dùng được', () => {
    const ds = D.dsModelChoAppThuan(NGUOI_CO_VE, false, {}, true);
    for (const id of ['cm-sonic', 'cm-optimum', 'cm-invisible']) assert.equal(lay(ds, id).dungDuoc, true, id);
  });

  it('không key + không gwai ⇒ xám; lý do CHỈ gửi cho admin', () => {
    const nguoi = D.dsModelChoAppThuan(NGUOI_CO_VE, false, {}, false);
    const admin = D.dsModelChoAppThuan(ADMIN, false, {}, false);
    for (const id of ['cm-sonic', 'cm-optimum', 'cm-invisible']) {
      assert.equal(lay(nguoi, id).dungDuoc, false);
      assert.equal(lay(nguoi, id).lyDo, undefined, 'người thường không nhận lý do');
      assert.equal(lay(admin, id).dungDuoc, false);
      assert.match(lay(admin, id).lyDo ?? '', /key Anthropic|gwai/);
    }
    /* Mặc định luôn dùng được, không lý do. */
    assert.equal(lay(admin, B.MA_DEFAULT).dungDuoc, true);
    assert.equal(lay(admin, B.MA_DEFAULT).lyDo, undefined);
  });

  it('khoá/vé giữ nguyên: người chưa có vé vẫn canMoKhoa; admin không bao giờ cần khoá', () => {
    const nguoi = D.dsModelChoAppThuan(NGUOI_KHONG_VE, false, {}, true);
    const admin = D.dsModelChoAppThuan(ADMIN, false, {}, true);
    for (const id of ['cm-sonic', 'cm-optimum', 'cm-invisible']) {
      assert.equal(lay(nguoi, id).canMoKhoa, true);
      assert.equal(lay(admin, id).canMoKhoa, false);
    }
  });

  it('tài khoản Free (chiDefault) không nhận lý do', () => {
    const ds = D.dsModelChoAppThuan(ADMIN, false, { chiDefault: true }, false);
    assert.ok(ds.every((m) => m.lyDo === undefined || m.id === B.MA_DEFAULT));
    assert.equal(lay(ds, 'cm-sonic').lyDo, undefined);
  });
});
