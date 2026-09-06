import { describe, expect, it } from 'vitest';
/* Kiểm TỆP DÙNG CHUNG `frontend/src/lib/lich/chung.ts` — web và desktop cùng
   nạp nó. Test nằm bên desktop vì đây là gói duy nhất có bộ chạy (frontend
   chưa cài vitest, và thêm một dependency chỉ để chạy 8 phép kiểm là cái giá
   không đáng). */
import { mauMon, MAU_MON, phuTheoGio, xepLan } from '@/lib/lich/chung';
import type { Buoi } from '@/lib/lich/chung';

const b = (id: number, startTime: string, endTime: string, subject = `M${id}`): Buoi =>
  ({ id, subject, weekday: 2, startTime, endTime });

describe('mauMon', () => {
  it('cùng tên môn LUÔN ra cùng màu — kể cả khi danh sách đổi', () => {
    expect(mauMon('SWT301')).toBe(mauMon('SWT301'));
  });
  it('màu do người dùng đặt thì thắng', () => {
    expect(mauMon('SWT301', '#123456')).toBe('#123456');
  });
  it('giá trị rác không phải mã màu thì BỎ QUA, không nhét vào CSS', () => {
    expect(MAU_MON).toContain(mauMon('SWT301', 'red; background: url(x)'));
    expect(MAU_MON).toContain(mauMon('SWT301', ''));
  });
  it('môn khác nhau thường ra màu khác nhau', () => {
    const ds = ['SWT301', 'FER202', 'SWR302', 'JPD123', 'LAB211'].map((m) => mauMon(m));
    expect(new Set(ds).size).toBeGreaterThanOrEqual(4);
  });
});

describe('phuTheoGio', () => {
  it('đánh dấu mọi giờ buổi học chạm tới, chỉ ô ĐẦU mang tên', () => {
    const m = phuTheoGio([b(1, '07:30', '09:50')]);
    expect([...m.keys()].sort((x, y) => x - y)).toEqual([7, 8, 9]);
    expect(m.get(7)?.dau).toBe(true);
    expect(m.get(8)?.dau).toBe(false);
    expect(m.get(9)?.dau).toBe(false);
  });

  it('hai buổi chồng giờ: giờ chung thuộc về buổi BẮT ĐẦU TRƯỚC', () => {
    const m = phuTheoGio([b(2, '09:00', '10:00', 'SAU'), b(1, '08:00', '11:00', 'TRUOC')]);
    expect(m.get(9)?.buoi.subject).toBe('TRUOC');
  });

  it('khớp với xepLan — cùng một tập giờ', () => {
    const ds = [b(1, '07:30', '09:50'), b(2, '12:50', '15:10')];
    const tuXep = new Set<number>();
    for (const x of xepLan(ds).o) for (let h = x.tu; h < x.den; h++) tuXep.add(h);
    expect(new Set(phuTheoGio(ds).keys())).toEqual(tuXep);
  });

  it('rỗng ⇒ map rỗng', () => {
    expect(phuTheoGio([]).size).toBe(0);
  });
});
