/**
 * Luật gập/mở nhóm dự án ở thanh bên AI Code — xem `nhomThanhBen.ts`.
 *
 * Chỗ đáng kiểm là THỨ TỰ ƯU TIÊN giữa bốn nguồn (đang tìm · đã bấm · ghim ·
 * việc đang xem) và cái trần 512 ký tự của setting: vượt trần là main từ chối
 * cả lệnh ghi, và lỗi đó im lặng.
 */
import { describe, expect, it } from 'vitest';

import {
  KHOA_GHIM, TRAN_KY_TU, boNho, datMo, giaiMaBangNho, maHoaBangNho, nhomDangMo,
} from './nhomThanhBen';

const mo = (p: Partial<Parameters<typeof nhomDangMo>[0]> & { khoa: string }): boolean =>
  nhomDangMo({ khoaDangXem: null, dangTim: false, bangNho: {}, bangKhiTim: {}, ...p });

describe('mặc định', () => {
  it('nhóm dự án GẬP, nhóm ghim MỞ', () => {
    expect(mo({ khoa: 'api-backend' })).toBe(false);
    expect(mo({ khoa: KHOA_GHIM })).toBe(true);
  });

  it('nhóm chứa việc đang xem tự MỞ', () => {
    expect(mo({ khoa: 'ett1', khoaDangXem: 'ett1' })).toBe(true);
    expect(mo({ khoa: 'api-backend', khoaDangXem: 'ett1' })).toBe(false);
  });
});

describe('lựa chọn của người dùng thắng mặc định', () => {
  it('gập được cả nhóm ghim lẫn nhóm đang xem', () => {
    expect(mo({ khoa: KHOA_GHIM, bangNho: { [KHOA_GHIM]: false } })).toBe(false);
    expect(mo({ khoa: 'ett1', khoaDangXem: 'ett1', bangNho: { ett1: false } })).toBe(false);
  });

  it('mở được nhóm dự án', () => {
    expect(mo({ khoa: 'api-backend', bangNho: { 'api-backend': true } })).toBe(true);
  });

  it('boNho ⇒ quay về mặc định', () => {
    const b = boNho({ ett1: false }, 'ett1');
    expect(mo({ khoa: 'ett1', khoaDangXem: 'ett1', bangNho: b })).toBe(true);
  });
});

describe('đang tìm', () => {
  it('mở MỌI nhóm có kết quả, kể cả nhóm đã gập', () => {
    expect(mo({ khoa: 'api-backend', dangTim: true, bangNho: { 'api-backend': false } })).toBe(true);
  });

  it('gập tay trong lúc tìm thì theo đó — và không đụng bảng nhớ', () => {
    const bangNho = { 'api-backend': true };
    expect(mo({ khoa: 'api-backend', dangTim: true, bangNho, bangKhiTim: { 'api-backend': false } })).toBe(false);
    // Xoá ô tìm ⇒ trở về lựa chọn đã nhớ.
    expect(mo({ khoa: 'api-backend', dangTim: false, bangNho, bangKhiTim: { 'api-backend': false } })).toBe(true);
  });
});

describe('lưu xuống setting', () => {
  it('ghi rồi đọc lại được nguyên vẹn', () => {
    const b = datMo(datMo({}, 'a', true), KHOA_GHIM, false);
    expect(giaiMaBangNho(maHoaBangNho(b))).toEqual(b);
  });

  it('giá trị hỏng ⇒ bảng rỗng, không ném lỗi', () => {
    for (const x of [undefined, 3, true, '', '{', '[1]', 'null', '{"a":"x"}']) {
      expect(giaiMaBangNho(x)).toEqual({});
    }
    expect(giaiMaBangNho('{"a":true,"b":"x"}')).toEqual({ a: true });
  });

  it('không bao giờ vượt 512 ký tự — bỏ mục CŨ NHẤT trước', () => {
    let b = {};
    for (let i = 0; i < 60; i += 1) b = datMo(b, `du-an-rat-dai-ten-so-${i}`, true);
    const s = maHoaBangNho(b);
    expect(s.length).toBeLessThanOrEqual(TRAN_KY_TU);
    const doc = giaiMaBangNho(s);
    expect(doc['du-an-rat-dai-ten-so-59']).toBe(true);
    expect(doc['du-an-rat-dai-ten-so-0']).toBeUndefined();
  });

  it('bấm lại một nhóm cũ ⇒ nó thành mục MỚI NHẤT', () => {
    const b = datMo(datMo(datMo({}, 'a', true), 'b', true), 'a', false);
    expect(Object.keys(b)).toEqual(['b', 'a']);
  });
});
