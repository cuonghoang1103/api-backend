import { describe, expect, it } from 'vitest';
import { docDongYtDlp, NHIP, tinhNhip } from './hoiDinhKy';

describe('tinhNhip — hỏi máy chủ thông minh', () => {
  it('nhanh khi đang chạy, chậm khi rảnh, ngừng khi ẩn + rảnh', () => {
    expect(tinhNhip({ dangChay: true, cuaSoHien: true, loiLienTiep: 0 })).toBe(NHIP.nhanh);
    expect(tinhNhip({ dangChay: true, cuaSoHien: false, loiLienTiep: 0 })).toBe(NHIP.an);
    expect(tinhNhip({ dangChay: false, cuaSoHien: true, loiLienTiep: 0 })).toBe(NHIP.ranh);
    expect(tinhNhip({ dangChay: false, cuaSoHien: false, loiLienTiep: 0 })).toBeNull();
  });
  it('lỗi liên tiếp ⇒ lùi cấp số nhân, không nhanh hơn nhịp gốc, trần 2 phút', () => {
    const n = (loi: number) => tinhNhip({ dangChay: true, cuaSoHien: true, loiLienTiep: loi })!;
    expect(n(1)).toBe(5_000);
    expect(n(2)).toBe(10_000);
    expect(n(3)).toBe(20_000);
    expect(n(6)).toBe(NHIP.tranLoi);
    expect(n(50)).toBe(NHIP.tranLoi);
    expect(tinhNhip({ dangChay: false, cuaSoHien: true, loiLienTiep: 1 })).toBe(NHIP.ranh);
    expect(tinhNhip({ dangChay: false, cuaSoHien: false, loiLienTiep: 3 })).toBeNull();
  });
});

describe('docDongYtDlp', () => {
  it('đọc dòng tiến độ theo khuôn của app', () => {
    expect(docDongYtDlp('CTLT|1048576|4194304|NA')).toEqual({ daNhan: 1048576, tong: 4194304 });
    expect(docDongYtDlp('CTLT|500|NA|2000.5')).toEqual({ daNhan: 500, tong: 2000.5 });
    expect(docDongYtDlp('CTLT|500|NA|NA')).toEqual({ daNhan: 500, tong: null });
    expect(docDongYtDlp('[download] 10% of 5MiB')).toBeNull();
    expect(docDongYtDlp('CTLT|NA|NA|NA')).toBeNull();
  });
});
