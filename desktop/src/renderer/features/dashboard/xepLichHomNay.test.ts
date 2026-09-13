import { describe, expect, it } from 'vitest';

import { soConLai, xepHomNay } from './xepLichHomNay';
import type { Buoi } from '@/lib/lich/chung';

const b = (id: number, startTime: string, endTime: string): Buoi =>
  ({ id, subject: `M${id}`, weekday: 2, startTime, endTime } as Buoi);

/** 14/09/2026 lúc `hh:mm` giờ máy. */
const luc = (hh: number, mm = 0) => new Date(2026, 8, 14, hh, mm, 0, 0);

describe('xếp buổi hôm nay', () => {
  const ds = [b(2, '10:00', '12:20'), b(1, '07:30', '09:50'), b(3, '12:50', '15:10')];

  it('sắp theo GIỜ, không theo thứ tự API trả về', () => {
    expect(xepHomNay(ds, luc(6)).map((x) => x.buoi.id)).toEqual([1, 2, 3]);
  });

  it('trước giờ học ⇒ tất cả "toi", buổi sớm nhất là kế tiếp', () => {
    const r = xepHomNay(ds, luc(6));
    expect(r.map((x) => x.trangThai)).toEqual(['toi', 'toi', 'toi']);
    expect(r.filter((x) => x.keTiep).map((x) => x.buoi.id)).toEqual([1]);
  });

  it('⛔ đang giữa buổi ⇒ "dang", KHÔNG phải "xong"', () => {
    // 09:00 nằm giữa 07:30–09:50. Chỉ so giờ BẮT ĐẦU thì buổi này thành "xong"
    // và người đang ngồi trong lớp nhìn màn hình thấy sai.
    const r = xepHomNay(ds, luc(9));
    expect(r[0]!.trangThai).toBe('dang');
  });

  it('⛔ buổi KẾ TIẾP là buổi sắp tới, không phải buổi đang học', () => {
    const r = xepHomNay(ds, luc(9));
    expect(r.filter((x) => x.keTiep).map((x) => x.buoi.id)).toEqual([2]);
  });

  it('đúng giờ kết thúc là đã xong', () => {
    expect(xepHomNay([b(1, '07:30', '09:50')], luc(9, 50))[0]!.trangThai).toBe('xong');
    expect(xepHomNay([b(1, '07:30', '09:50')], luc(9, 49))[0]!.trangThai).toBe('dang');
  });

  it('đúng giờ bắt đầu là đã vào học', () => {
    expect(xepHomNay([b(1, '07:30', '09:50')], luc(7, 30))[0]!.trangThai).toBe('dang');
    expect(xepHomNay([b(1, '07:30', '09:50')], luc(7, 29))[0]!.trangThai).toBe('toi');
  });

  it('hết buổi trong ngày ⇒ không buổi nào mang cờ kế tiếp', () => {
    const r = xepHomNay(ds, luc(20));
    expect(r.every((x) => x.trangThai === 'xong')).toBe(true);
    expect(r.some((x) => x.keTiep)).toBe(false);
  });

  it('CHỈ MỘT buổi mang cờ kế tiếp', () => {
    expect(xepHomNay(ds, luc(6)).filter((x) => x.keTiep)).toHaveLength(1);
  });

  it('danh sách rỗng không làm vỡ gì', () => {
    expect(xepHomNay([], luc(9))).toEqual([]);
    expect(soConLai([])).toBe(0);
  });
});

describe('đếm buổi còn lại', () => {
  const ds = [b(1, '07:30', '09:50'), b(2, '10:00', '12:20'), b(3, '12:50', '15:10')];

  it('buổi ĐANG học vẫn tính là còn lại', () => {
    // Nó chưa xong, và nó vẫn là việc người dùng đang phải có mặt.
    expect(soConLai(xepHomNay(ds, luc(9)))).toBe(3);
  });

  it('đếm giảm dần theo buổi đã tan', () => {
    expect(soConLai(xepHomNay(ds, luc(6)))).toBe(3);
    expect(soConLai(xepHomNay(ds, luc(11)))).toBe(2);
    expect(soConLai(xepHomNay(ds, luc(20)))).toBe(0);
  });
});
