import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CAU_HOI_SAN, locHanhDong, tachJson } from './aiThongKe.js';

const xepHang = [
  { userId: 7, ten: 'An', goi: 'pro' },
  { userId: 9, ten: 'Admin', goi: 'admin' },
  { userId: null, ten: 'Hệ thống', goi: 'không rõ' },
] as never;

describe('aiThongKe', () => {
  it('tachJson đọc cả khi model bọc ```json', () => {
    assert.deepEqual(tachJson('```json\n{"traLoi":"ok","hanhDong":[]}\n```'), { traLoi: 'ok', hanhDong: [] });
    assert.equal(tachJson('không có json'), null);
  });

  it('locHanhDong chỉ giữ đề xuất hợp lệ: đúng người, không admin, số trong 0–1000', () => {
    const ra = locHanhDong([
      { loai: 'dat_tran', userId: 7, hang: 'free', ngayUsd: 3, thangUsd: 40, lyDo: 'vọt gấp 5' },
      { loai: 'dat_tran', userId: 9, hang: 'free', ngayUsd: 1 },       // admin ⇒ bỏ
      { loai: 'dat_tran', userId: 123, hang: 'free', ngayUsd: 1 },     // không có trong bảng ⇒ bỏ
      { loai: 'dat_tran', userId: 7, hang: 'cao', ngayUsd: 99999 },    // ngoài khoảng, không có số khác ⇒ bỏ
      { loai: 'dat_tran', userId: 7, hang: 'cao' },                    // không có số nào ⇒ bỏ
      { loai: 'xoa_tran', userId: 7, lyDo: 'về theo gói' },
      { loai: 'xoa', userId: 7 },                                      // loại lạ ⇒ bỏ
    ], { xepHang });
    assert.equal(ra.length, 2);
    assert.deepEqual(ra[0], { loai: 'dat_tran', userId: 7, ten: 'An', hang: 'free', ngayUsd: 3, thangUsd: 40, lyDo: 'vọt gấp 5' });
    assert.equal(ra[1]!.loai, 'xoa_tran');
    assert.deepEqual(locHanhDong('x', { xepHang }), []);
  });

  it('câu hỏi có sẵn có id duy nhất', () => {
    const ids = CAU_HOI_SAN.map((c) => c.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(ids.includes('xep-hang') && ids.includes('de-xuat'));
  });
});
