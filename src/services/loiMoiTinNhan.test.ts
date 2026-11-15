/**
 * Luật "lời mời nhắn tin" + chuẩn hoá ô tìm người (phần thuần, không cần DB).
 *   npx tsx --test src/services/loiMoiTinNhan.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { laLoiMoi, type DuKienLoiMoi } from './loiMoiTinNhan.js';
import { chuanHoaTim } from './ctlanguage/tinNhanCTL.js';

const nguoiLa: DuKienLoiMoi = { type: 'USER', coTin: true, toiDaGui: false, daChapNhan: false, quen: false };

describe('laLoiMoi', () => {
  it('người lạ nhắn tới, mình chưa trả lời ⇒ lời mời', () => {
    assert.equal(laLoiMoi(nguoiLa), true);
  });
  it('mình đã gửi một tin (trả lời / tự mở hội thoại) ⇒ không còn là lời mời', () => {
    assert.equal(laLoiMoi({ ...nguoiLa, toiDaGui: true }), false);
  });
  it('đã bấm Chấp nhận ⇒ hộp chính', () => {
    assert.equal(laLoiMoi({ ...nguoiLa, daChapNhan: true }), false);
  });
  it('người quen (bạn bè / mình theo dõi họ / cùng không gian) ⇒ hộp chính', () => {
    assert.equal(laLoiMoi({ ...nguoiLa, quen: true }), false);
  });
  it('hội thoại hỗ trợ ADMIN không bao giờ là lời mời', () => {
    assert.equal(laLoiMoi({ ...nguoiLa, type: 'ADMIN' }), false);
  });
  it('hội thoại rỗng (chưa có tin) không là lời mời', () => {
    assert.equal(laLoiMoi({ ...nguoiLa, coTin: false }), false);
  });
});

describe('chuanHoaTim', () => {
  it('gọn khoảng trắng, bỏ @ đầu, rỗng ⇒ null, cắt 60 ký tự', () => {
    assert.equal(chuanHoaTim('  @@Lan   Anh  '), 'Lan Anh');
    assert.equal(chuanHoaTim('   '), null);
    assert.equal(chuanHoaTim(undefined), null);
    assert.equal(chuanHoaTim('x'.repeat(100))?.length, 60);
  });
});
