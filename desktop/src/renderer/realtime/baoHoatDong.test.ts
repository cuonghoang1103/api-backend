// @vitest-environment jsdom
/**
 * Nhịp báo hoạt động: thứ duy nhất ghi `users.last_active_at` cho người dùng
 * APP. Thiếu nó thì dòng "Hoạt động N phút trước" sai vĩnh viễn — mà sai một
 * cách câm lặng, vì app vẫn chạy trơn và không có lỗi nào.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { batBaoHoatDong, ngungBaoHoatDong } from './baoHoatDong';

let duong: string[];
const apiGia = {
  request: (p: string) => { duong.push(p); return Promise.resolve({}); },
} as never;

function datHienThi(v: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', { value: v, configurable: true });
}

beforeEach(() => {
  duong = [];
  vi.useFakeTimers();
  datHienThi('visible');
});

afterEach(() => {
  ngungBaoHoatDong();
  vi.useRealTimers();
});

describe('batBaoHoatDong', () => {
  it('báo NGAY, không đợi hết nhịp đầu', () => {
    batBaoHoatDong(apiGia);
    expect(duong).toEqual(['/api/v1/users/status']);
  });

  it('lặp theo nhịp 45s — PHẢI nhỏ hơn ngưỡng 60s của follow.service.ts', async () => {
    batBaoHoatDong(apiGia);
    await vi.advanceTimersByTimeAsync(45_000);
    await vi.advanceTimersByTimeAsync(45_000);
    expect(duong.length, 'nhịp ≥60s làm người khác thấy mình nhấp nháy online/offline').toBe(3);
  });

  it('cửa sổ bị ẩn thì KHÔNG báo — không thì để app qua đêm là cả đêm "đang hoạt động"', async () => {
    batBaoHoatDong(apiGia);
    duong = [];
    datHienThi('hidden');
    await vi.advanceTimersByTimeAsync(45_000 * 3);
    expect(duong).toEqual([]);
  });

  it('ngừng rồi thì im hẳn — không báo hộ người vừa đăng xuất', async () => {
    batBaoHoatDong(apiGia);
    ngungBaoHoatDong();
    duong = [];
    await vi.advanceTimersByTimeAsync(45_000 * 3);
    expect(duong).toEqual([]);
  });

  it('gọi lại lần hai KHÔNG nhân đôi nhịp', async () => {
    batBaoHoatDong(apiGia);
    batBaoHoatDong(apiGia);
    duong = [];
    await vi.advanceTimersByTimeAsync(45_000);
    expect(duong.length, 'hai bộ đếm cùng chạy = gấp đôi lời gọi mạng').toBe(1);
  });
});
