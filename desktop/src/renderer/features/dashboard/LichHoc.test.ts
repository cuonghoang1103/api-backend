/**
 * Lịch học — canh phần ngày/giờ, chỗ duy nhất trong khối này sai được mà im lặng.
 *
 * Sai một ngày ở đây nghĩa là điểm danh ghi vào SAI BUỔI, và con số buổi nghỉ —
 * thứ quyết định đỗ hay trượt môn — lệch theo. Không có gì trên màn hình báo.
 */
import { describe, expect, it } from 'vitest';
import { conMayPhut, ngayCuaThu, ngayISO } from './LichHoc';

/** 07/09/2026 là THỨ HAI (khớp lịch trong ảnh người dùng gửi). */
const THU_HAI = new Date(2026, 8, 7, 10, 0, 0);
const CHU_NHAT = new Date(2026, 8, 13, 10, 0, 0);

describe('ngày của thứ N trong tuần', () => {
  it('từ thứ Hai: thứ 2..CN ra đúng 7..13/9', () => {
    expect([2, 3, 4, 5, 6, 7, 8].map((n) => ngayISO(ngayCuaThu(THU_HAI, n)))).toEqual([
      '2026-09-07', '2026-09-08', '2026-09-09', '2026-09-10',
      '2026-09-11', '2026-09-12', '2026-09-13',
    ]);
  });

  it('từ CHỦ NHẬT vẫn ra ĐÚNG tuần đó, không nhảy sang tuần sau', () => {
    /* Đây là ca lỗi kinh điển: `Date.getDay()` cho Chủ nhật = 0, nên mọi phép
       tính ngây thơ sẽ coi CN là đầu tuần và đẩy cả tuần lùi 7 ngày. Ở đây CN
       được quy thành 8, nên nó là ngày CUỐI của chính tuần ấy. */
    expect(ngayISO(ngayCuaThu(CHU_NHAT, 2))).toBe('2026-09-07');
    expect(ngayISO(ngayCuaThu(CHU_NHAT, 8))).toBe('2026-09-13');
  });

  it('ngayISO dùng giờ MÁY, không phải UTC', () => {
    /* `toISOString()` cho giờ UTC: ở UTC+7, 00:30 ngày 7 sẽ thành ngày 6. Điểm
       danh buổi sáng sớm khi đó ghi vào hôm qua — đúng họ hàng với lỗi UTC đã
       vá ở phần quản lý việc. */
    expect(ngayISO(new Date(2026, 8, 7, 0, 30))).toBe('2026-09-07');
    expect(ngayISO(new Date(2026, 8, 7, 23, 45))).toBe('2026-09-07');
  });
});

describe('còn mấy phút tới giờ học', () => {
  const bay = new Date(2026, 8, 7, 7, 0, 0);
  it('trước giờ ⇒ dương', () => { expect(conMayPhut('07:30', bay)).toBe(30); });
  it('đúng giờ ⇒ 0', () => { expect(conMayPhut('07:00', bay)).toBe(0); });
  it('đã qua ⇒ ÂM, để chỗ gọi biết mà không nhắc nữa', () => {
    expect(conMayPhut('06:30', bay)).toBe(-30);
  });
});
