/**
 * Đồng hồ đếm ngược của robot. Nó nói 10 phút một lần cả ngày, nên một câu sai
 * không phải "một lỗi nhỏ" — nó là một lỗi lặp lại 60 lần mỗi ngày.
 */
import { describe, expect, it } from 'vitest';
import { buoiSomNhat, cauNhac, moTaKhoang, XA_NHAT_PHUT } from './nhacLichRobot';
import type { Buoi } from './LichHoc';

/** 07/09/2026 là THỨ HAI ⇒ weekday 2. */
const t = (h: number, p = 0) => new Date(2026, 8, 7, h, p, 0);
const b = (id: number, startTime: string, weekday = 2, extra: Partial<Buoi> = {}): Buoi =>
  ({ id, subject: `MON${id}`, weekday, startTime, endTime: '23:59', ...extra });

describe('moTaKhoang', () => {
  it('dưới một giờ thì chỉ nói phút', () => {
    expect(moTaKhoang(35)).toBe('35 phút');
    expect(moTaKhoang(1)).toBe('1 phút');
  });
  it('tròn giờ thì KHÔNG nói "0 phút"', () => {
    expect(moTaKhoang(60)).toBe('1 giờ');
    expect(moTaKhoang(120)).toBe('2 giờ');
  });
  it('lẻ thì nói cả hai', () => {
    expect(moTaKhoang(95)).toBe('1 giờ 35 phút');
  });
  it('số âm không rò ra thành "-1 phút"', () => {
    expect(moTaKhoang(-5)).toBe('0 phút');
  });
});

describe('buoiSomNhat', () => {
  it('chọn buổi gần nhất còn CHƯA bắt đầu', () => {
    const kq = buoiSomNhat([b(1, '15:00'), b(2, '10:00'), b(3, '12:00')], t(9));
    expect(kq?.buoi.id).toBe(2);
    expect(kq?.phut).toBe(60);
  });

  it('bỏ buổi ĐÃ qua giờ — không đếm ngược số âm', () => {
    expect(buoiSomNhat([b(1, '07:30')], t(9))).toBeNull();
  });

  it('bỏ buổi của thứ KHÁC', () => {
    expect(buoiSomNhat([b(1, '10:00', 5)], t(9))).toBeNull();
  });

  it(`im lặng khi còn xa hơn ${XA_NHAT_PHUT} phút`, () => {
    expect(buoiSomNhat([b(1, '20:00')], t(9))).toBeNull();
    expect(buoiSomNhat([b(1, '13:00')], t(9))?.phut).toBe(240);
  });

  it('Chủ nhật (getDay()===0) map đúng sang weekday 8', () => {
    const cn = new Date(2026, 8, 13, 9, 0, 0);
    expect(cn.getDay()).toBe(0);
    expect(buoiSomNhat([b(1, '10:00', 8)], cn)?.buoi.id).toBe(1);
    expect(buoiSomNhat([b(1, '10:00', 2)], cn)).toBeNull();
  });

  it('danh sách rỗng ⇒ null', () => {
    expect(buoiSomNhat([], t(9))).toBeNull();
  });
});

describe('cauNhac', () => {
  it('nói mã lớp nếu có, kèm phòng và giờ', () => {
    const x = b(1, '10:00', 2, { classCode: 'SE1815', room: 'DE-412' });
    expect(cauNhac(x, 95)).toBe('Còn 1 giờ 35 phút nữa là học SE1815 ở DE-412 (10:00).');
  });

  it('không có phòng thì không để lại chữ "ở" cụt', () => {
    expect(cauNhac(b(1, '10:00'), 30)).toBe('Còn 30 phút nữa là học MON1 (10:00).');
  });

  it('sát giờ (≤5 phút) đổi sang câu giục', () => {
    expect(cauNhac(b(1, '10:00', 2, { room: 'BE-201' }), 4))
      .toBe('Sắp vào MON1 ở BE-201 rồi — còn 4 phút!');
  });
});

/**
 * VÌ SAO câu nhắc đi qua `announceTam()` chứ không phải `announce()`.
 *
 * `announce()` bóc markdown (nó dựng chữ cho MÁY ĐỌC). Với câu do app tự viết
 * thì việc đó chỉ có hại: bộ bóc coi hai gạch dưới trong cùng một câu là một
 * cặp chữ nghiêng, mà mã lớp FPT có gạch dưới thật ("AI17_A", "BE-2_1") — nên
 * người dùng đọc ra SAI PHÒNG HỌC, mỗi 10 phút một lần.
 *
 * Phép kiểm này canh chính cái bẫy đó: nếu ai đó đổi `announceTam` sang dùng
 * lại bộ bóc, ở đây sẽ đỏ.
 */
describe('bộ bóc markdown ăn mất gạch dưới trong mã lớp', () => {
  it('hai mã có "_" trong một câu bị nuốt — nên đường nhắc KHÔNG được bóc', async () => {
    const { chuChoMayDoc } = await import('../odin/loiNoi');
    const c = cauNhac(b(1, '13:00', 2, { classCode: 'AI17_A', room: 'BE-2_1' }), 7);
    expect(c).toContain('AI17_A');
    expect(c).toContain('BE-2_1');
    // Đây là hành vi THẬT, đo được — không phải suy từ mã.
    expect(chuChoMayDoc(c)).not.toContain('AI17_A');
    expect(chuChoMayDoc(c)).not.toContain('BE-2_1');
  });

  it('một mã có "_" đứng một mình thì vẫn qua được — nên bẫy này khó thấy', async () => {
    const { chuChoMayDoc } = await import('../odin/loiNoi');
    const c = cauNhac(b(1, '10:00', 2, { classCode: 'SE1730_NJ', room: 'DE-412' }), 30);
    expect(chuChoMayDoc(c)).toBe(c);
  });
});
