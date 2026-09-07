import { describe, expect, it } from 'vitest';
import { xepLan } from './dai24';
import type { Buoi } from './LichHoc';

const b = (id: number, startTime: string, endTime: string): Buoi =>
  ({ id, subject: `M${id}`, weekday: 2, startTime, endTime });

describe('xepLan', () => {
  it('phủ đúng những giờ buổi học CHẠM tới', () => {
    // 07:30–09:50 chạm giờ 7, 8, 9 ⇒ cột [7, 10)
    expect(xepLan([b(1, '07:30', '09:50')]).o[0]).toMatchObject({ tu: 7, den: 10 });
  });

  it('buổi khít đầu giờ không chiếm thừa cột', () => {
    expect(xepLan([b(1, '08:00', '10:00')]).o[0]).toMatchObject({ tu: 8, den: 10 });
  });

  it('buổi ngắn trong một giờ vẫn chiếm đúng 1 cột', () => {
    expect(xepLan([b(1, '09:10', '09:40')]).o[0]).toMatchObject({ tu: 9, den: 10 });
  });

  it('nhiều buổi KHÔNG chồng nhau thì cùng một làn', () => {
    const { o, soLan } = xepLan([b(1, '07:30', '09:50'), b(2, '10:00', '12:20')]);
    expect(o.map((x) => x.lan)).toEqual([0, 0]);
    expect(soLan).toBe(1);
  });

  it('hai buổi CHỒNG giờ thì tách làn, không đè lên nhau', () => {
    const { o, soLan } = xepLan([b(1, '08:00', '11:00'), b(2, '09:00', '10:00')]);
    expect(o.map((x) => x.lan)).toEqual([0, 1]);
    expect(soLan).toBe(2);
  });

  it('buổi chạm nhau đúng ranh giới cột vẫn chung làn', () => {
    // 07:30–09:50 phủ [7,10); 10:00–12:20 phủ [10,13) — không giao nhau.
    expect(xepLan([b(1, '07:30', '09:50'), b(2, '10:00', '12:20')]).soLan).toBe(1);
  });

  /* Ca THƯỜNG GẶP NHẤT của thời khoá biểu, và là ca từng đẻ ra một tầng thừa:
     10:00–12:20 rồi 12:50–15:10 KHÔNG hề chồng nhau, nhưng cả hai cùng chạm
     giờ 12. Xếp làn theo cột đã làm tròn thì buổi sau bị đẩy xuống làn hai cho
     một xung đột không có thật. Phải xếp theo GIỜ THẬT rồi cắt bớt đuôi. */
  it('hai buổi LIỀN NHAU cùng chạm một giờ ⇒ vẫn MỘT làn, buổi trước bị cắt đuôi', () => {
    const { o, soLan } = xepLan([b(1, '10:00', '12:20'), b(2, '12:50', '15:10')]);
    expect(soLan).toBe(1);
    expect(o.map((x) => x.lan)).toEqual([0, 0]);
    expect(o[0]).toMatchObject({ tu: 10, den: 12 }); // cắt từ 13 → 12
    expect(o[1]).toMatchObject({ tu: 12, den: 16 });
  });

  it('cắt đuôi KHÔNG BAO GIỜ làm ô rộng 0 cột', () => {
    // 12:10–12:40 rồi 12:50–13:10: cả hai đều nằm gọn trong giờ 12.
    const { o } = xepLan([b(1, '12:10', '12:40'), b(2, '12:50', '13:10')]);
    for (const x of o) expect(x.den).toBeGreaterThan(x.tu);
  });

  it('buổi CHỒNG THẬT vẫn tách làn, không bị cắt oan', () => {
    const { o, soLan } = xepLan([b(1, '08:00', '11:00'), b(2, '09:00', '10:00')]);
    expect(soLan).toBe(2);
    expect(o[0]).toMatchObject({ tu: 8, den: 11 });
  });

  it('giờ hỏng thì BỎ, không nổ và không vẽ ô ma', () => {
    expect(xepLan([b(1, '', ''), b(2, '25:00', '26:00'), b(3, '10:00', '09:00')]).o).toEqual([]);
  });

  it('buổi tràn nửa đêm bị kẹp trong 24 cột', () => {
    expect(xepLan([b(1, '23:30', '23:59')]).o[0]).toMatchObject({ tu: 23, den: 24 });
  });

  it('danh sách rỗng ⇒ 0 làn', () => {
    expect(xepLan([])).toEqual({ o: [], soLan: 0 });
  });
});
