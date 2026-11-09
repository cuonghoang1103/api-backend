import { describe, expect, it } from 'vitest';
import { khoaNgay, nhomTheoNgay } from './CtcNhomNgay';

const BAY_GIO = new Date(2026, 10, 9, 15, 0, 0).getTime(); // 09/11/2026 15:00 giờ máy
const luc = (ngay: number, gio = 10): string => new Date(2026, 10, ngay, gio).toISOString();

describe('khoaNgay', () => {
  it('mốc hôm nay là 0 giờ, không phải 24 giờ trước', () => {
    expect(khoaNgay(luc(9, 0), BAY_GIO)).toBe('homNay');
    expect(khoaNgay(luc(8, 23), BAY_GIO)).toBe('tuan');
  });
  it('7 ngày / 30 ngày / cũ hơn', () => {
    expect(khoaNgay(luc(3), BAY_GIO)).toBe('tuan');
    expect(khoaNgay(luc(1), BAY_GIO)).toBe('thang');
    expect(khoaNgay(new Date(2026, 8, 1).toISOString(), BAY_GIO)).toBe('cu');
    expect(khoaNgay('không phải ngày', BAY_GIO)).toBe('cu');
  });
});

describe('nhomTheoNgay', () => {
  it('ghim lên đầu, giữ thứ tự trong nhóm, bỏ nhóm rỗng', () => {
    const ds = [
      { id: 'a', updatedAt: luc(9, 14) },
      { id: 'b', updatedAt: luc(5), pinned: true },
      { id: 'c', updatedAt: luc(9, 9) },
      { id: 'd', updatedAt: new Date(2025, 0, 1).toISOString() },
    ];
    const r = nhomTheoNgay(ds, BAY_GIO);
    expect(r.map((n) => n.khoa)).toEqual(['ghim', 'homNay', 'cu']);
    expect(r[1]!.ds.map((p) => p.id)).toEqual(['a', 'c']);
  });
});
