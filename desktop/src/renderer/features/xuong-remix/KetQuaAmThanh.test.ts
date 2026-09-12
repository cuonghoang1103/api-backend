/**
 * Kiểm tên gợi ý cho bài đẩy lên bàn DJ.
 *
 * Nhỏ, nhưng nó là chuỗi DUY NHẤT người dùng nhìn thấy khi chọn bài trong danh
 * sách thả xuống của bàn DJ — lúc đang đứng đánh, không có chỗ nào khác để
 * xem nhịp và tông.
 */
import { describe, expect, it } from 'vitest';
import { tenGoiY } from './KetQuaAmThanh';

describe('tenGoiY', () => {
  it('bỏ đuôi tệp và ghép nhịp với tông', () => {
    expect(tenGoiY('Bài của tôi (tron).wav', 139.8, '8A')).toBe('Bài của tôi (tron) · 140 BPM · 8A');
  });

  it('làm tròn nhịp — "139.8 BPM" trong tên bài là thừa số lẻ', () => {
    expect(tenGoiY('x.wav', 128.4)).toBe('x · 128 BPM');
  });

  it('thiếu nhịp hay tông thì bỏ hẳn phần đó, không để dấu chấm lửng lơ', () => {
    expect(tenGoiY('x.wav')).toBe('x');
    expect(tenGoiY('x.wav', 0, '')).toBe('x');
    expect(tenGoiY('x.wav', undefined, '8A')).toBe('x · 8A');
  });

  it('tên có nhiều dấu chấm chỉ mất đuôi cuối', () => {
    expect(tenGoiY('DJ Tilo - Nonstop 2026.v2.wav')).toBe('DJ Tilo - Nonstop 2026.v2');
  });
});
