import { describe, expect, it } from 'vitest';
import { docCheDo, docGio, giaiChuDe, laGioSang, msToiMocKe } from './chuDe';

const luc = (h: number, m = 0) => new Date(2026, 10, 8, h, m, 0, 0);

describe('chủ đề — bốn chế độ', () => {
  it('giá trị cũ vẫn hợp lệ, rác ⇒ Mặc định (system)', () => {
    expect(docCheDo('system')).toBe('system');
    expect(docCheDo('light')).toBe('light');
    expect(docCheDo('theo-gio')).toBe('theo-gio');
    expect(docCheDo(undefined)).toBe('system');
    expect(docCheDo('auto')).toBe('system');
  });

  it('Mặc định theo hệ điều hành; Sáng/Tối cố định', () => {
    expect(giaiChuDe('system', { heThongToi: true })).toBe('dark');
    expect(giaiChuDe('system', { heThongToi: false })).toBe('light');
    expect(giaiChuDe('light', { heThongToi: true })).toBe('light');
    expect(giaiChuDe('dark', { heThongToi: false })).toBe('dark');
  });

  it('Theo giờ: sáng 06:00 → trước 18:00', () => {
    const g = (h: number, m = 0) => giaiChuDe('theo-gio', { heThongToi: true, bayGio: luc(h, m) });
    expect(g(5, 59)).toBe('dark');
    expect(g(6, 0)).toBe('light');
    expect(g(12)).toBe('light');
    expect(g(17, 59)).toBe('light');
    expect(g(18, 0)).toBe('dark');
    expect(g(23)).toBe('dark');
  });

  it('khoảng vắt qua nửa đêm và khoảng rỗng', () => {
    expect(laGioSang(21, 20, 4)).toBe(true);
    expect(laGioSang(3, 20, 4)).toBe(true);
    expect(laGioSang(12, 20, 4)).toBe(false);
    expect(laGioSang(12, 7, 7)).toBe(true);
  });

  it('giờ cấu hình hỏng ⇒ mặc định', () => {
    expect(docGio(7, 6)).toBe(7);
    expect(docGio('19', 18)).toBe(19);
    expect(docGio(24, 18)).toBe(18);
    expect(docGio(6.5, 6)).toBe(6);
    expect(docGio(undefined, 6)).toBe(6);
  });

  it('hẹn đúng mốc kế tiếp', () => {
    expect(msToiMocKe(luc(17, 30), 6, 18)).toBe(30 * 60_000);
    expect(msToiMocKe(luc(18, 0), 6, 18)).toBe(12 * 3600_000);
    expect(msToiMocKe(luc(23, 0), 6, 18)).toBe(7 * 3600_000);
  });
});
