/**
 * Canh cửa của bảng soạn lịch: dòng nào KHÔNG hợp lệ thì không được gửi lên.
 *
 * Máy chủ cũng kiểm, nhưng nó trả về một lỗi cho CẢ lượt — người dùng dán 20
 * buổi rồi nhận "INVALID_TIME" mà không biết dòng nào. Chốt ở đây để lỗi chỉ
 * đúng vào dòng hỏng.
 */
import { describe, expect, it } from 'vitest';
import { loiDong } from './SoanLich';

const ok = { subject: 'SWT301', weekday: 2, startTime: '07:30', endTime: '09:50' };

describe('loiDong', () => {
  it('dòng đủ thì không lỗi', () => {
    expect(loiDong(ok)).toBeNull();
  });

  it('thiếu tên môn', () => {
    expect(loiDong({ ...ok, subject: '   ' })).toBe('Thiếu tên môn');
  });

  it('chưa chọn thứ (parser đọc hụt để 0)', () => {
    expect(loiDong({ ...ok, weekday: 0 })).toBe('Chưa chọn thứ');
  });

  it('thứ ngoài 2..8', () => {
    expect(loiDong({ ...ok, weekday: 9 })).toBe('Chưa chọn thứ');
    expect(loiDong({ ...ok, weekday: 1 })).toBe('Chưa chọn thứ');
  });

  it('giờ sai dạng — kể cả "7:30" thiếu số 0 đằng trước', () => {
    expect(loiDong({ ...ok, startTime: '7:30' })).toBe('Giờ phải dạng HH:mm');
    expect(loiDong({ ...ok, endTime: '25:00' })).toBe('Giờ phải dạng HH:mm');
    expect(loiDong({ ...ok, endTime: '09:70' })).toBe('Giờ phải dạng HH:mm');
    expect(loiDong({ ...ok, startTime: '' })).toBe('Giờ phải dạng HH:mm');
  });

  it('kết thúc không được bằng hoặc trước bắt đầu', () => {
    expect(loiDong({ ...ok, endTime: '07:30' })).toBe('Giờ kết thúc phải sau giờ bắt đầu');
    expect(loiDong({ ...ok, endTime: '06:00' })).toBe('Giờ kết thúc phải sau giờ bắt đầu');
  });

  it('buổi qua trưa và buổi tối vẫn hợp lệ', () => {
    expect(loiDong({ ...ok, startTime: '12:50', endTime: '15:10' })).toBeNull();
    expect(loiDong({ ...ok, startTime: '18:00', endTime: '20:20' })).toBeNull();
  });
});
