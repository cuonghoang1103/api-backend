import { describe, expect, it } from 'vitest';

import { MAU_KHO, TEN_KHO, tomTatNgay, trangThai, xepTheoGio } from './keHoach';

describe('trạng thái suy ra', () => {
  it('ba trạng thái từ hai trường', () => {
    expect(trangThai({ done: true, truotLuc: null })).toBe('xong');
    expect(trangThai({ done: false, truotLuc: '2026-09-18T10:00:00Z' })).toBe('truot');
    expect(trangThai({ done: false, truotLuc: null })).toBe('dangLam');
  });

  it('⛔ làm nốt việc ĐÃ trượt thì hiện là XONG, không phải trượt', () => {
    // `truotLuc` được giữ lại làm lịch sử (và làm chốt chống trừ hai
    // lần), nên nó KHÔNG được thắng `done`. Đảo thứ tự hai dòng kiểm
    // tra là việc vừa làm xong vẫn hiện đỏ — người dùng làm rồi mà
    // bảng vẫn tố họ.
    expect(trangThai({ done: true, truotLuc: '2026-09-18T10:00:00Z' })).toBe('xong');
  });
});

describe('xếp việc theo giờ', () => {
  it('việc có giờ lên trước, theo thứ tự giờ', () => {
    const r = xepTheoGio([
      { id: 1, batDauAt: '2026-09-18T09:00:00Z' },
      { id: 2, batDauAt: '2026-09-18T07:00:00Z' },
    ]);
    expect(r.map((x) => x.id)).toEqual([2, 1]);
  });

  it('việc KHÔNG hẹn giờ xuống CUỐI, không chen vào giữa', () => {
    // Phần trên danh sách là thời khoá biểu; chen một việc không giờ
    // vào giữa làm hỏng cách đọc theo dòng thời gian.
    const r = xepTheoGio([
      { id: 1, batDauAt: null },
      { id: 2, batDauAt: '2026-09-18T09:00:00Z' },
      { id: 3, batDauAt: null },
      { id: 4, batDauAt: '2026-09-18T07:00:00Z' },
    ]);
    expect(r.map((x) => x.id)).toEqual([4, 2, 1, 3]);
  });

  it('không sửa mảng gốc', () => {
    const goc = [{ id: 2, batDauAt: null }, { id: 1, batDauAt: null }];
    xepTheoGio(goc);
    expect(goc.map((x) => x.id)).toEqual([2, 1]);
  });
});

describe('tóm tắt ngày', () => {
  it('đếm đủ ba loại', () => {
    const t = tomTatNgay([
      { done: true, truotLuc: null },
      { done: false, truotLuc: '2026-09-18T10:00:00Z' },
      { done: false, truotLuc: null },
      { done: false, truotLuc: null },
    ]);
    expect(t).toEqual({ tong: 4, xong: 1, truot: 1, con: 2 });
  });

  it('ngày trống trả null chứ không phải "0/0"', () => {
    expect(tomTatNgay([])).toBeNull();
  });

  it('việc làm nốt sau khi trượt tính là XONG, không đếm hai lần', () => {
    const t = tomTatNgay([{ done: true, truotLuc: '2026-09-18T10:00:00Z' }]);
    expect(t).toEqual({ tong: 1, xong: 1, truot: 0, con: 0 });
  });
});

describe('bảng màu độ khó', () => {
  it('đủ 4 mức, mỗi mức có cả TÊN chữ', () => {
    // Màu không bao giờ được là kênh thông tin duy nhất: ~8% nam giới
    // mù màu đỏ-lục, và với họ bảng phân biệt bằng riêng màu là bảng trắng.
    for (const m of [0, 1, 2, 3]) {
      expect(MAU_KHO[m]).toBeTruthy();
      expect(TEN_KHO[m]!.length).toBeGreaterThan(1);
    }
  });
});
