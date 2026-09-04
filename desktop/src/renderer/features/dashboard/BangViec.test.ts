/**
 * Bảng việc — canh hai hàm thuần dễ sai và sai CÂM.
 */
import { describe, expect, it } from 'vitest';
import { conBaoLau } from './BangViec';

const MOC = new Date('2026-09-05T10:00:00Z').getTime();
const cong = (phut: number) => new Date(MOC + phut * 60000).toISOString();

describe('còn bao lâu tới hạn', () => {
  it('không có hạn ⇒ null, không phải "còn 0 phút"', () => {
    expect(conBaoLau(null, MOC)).toBeNull();
    expect(conBaoLau(undefined, MOC)).toBeNull();
    expect(conBaoLau('', MOC)).toBeNull();
  });

  it('chuỗi rác ⇒ null, KHÔNG phải NaN hiện lên màn hình', () => {
    /* `new Date('hôm nào đó')` cho Invalid Date, và mọi phép tính sau đó ra NaN.
       Không chặn thì người dùng thấy "còn NaN phút" — trông như app hỏng nặng
       trong khi chỉ là một trường dữ liệu xấu. */
    expect(conBaoLau('không phải ngày', MOC)).toBeNull();
  });

  it('sắp tới: phút → giờ → ngày', () => {
    expect(conBaoLau(cong(25), MOC)?.chu).toBe('còn 25 phút');
    expect(conBaoLau(cong(180), MOC)?.chu).toBe('còn 3 giờ');
    expect(conBaoLau(cong(1440), MOC)?.chu).toBe('ngày mai');
    expect(conBaoLau(cong(4320), MOC)?.chu).toBe('còn 3 ngày');
  });

  it('quá hạn ⇒ nói TRỄ, và luôn là gấp', () => {
    const t = conBaoLau(cong(-30), MOC);
    expect(t?.chu).toBe('trễ 30 phút');
    expect(t?.treZ).toBe(true);
    expect(t?.gap).toBe(true);
  });

  it('cờ "gấp" bật trong 4 giờ tới, tắt khi còn xa', () => {
    /* Đây là thứ quyết định màu của thẻ hạn. Bật quá rộng thì cả danh sách đỏ
       và màu mất hết ý nghĩa; bật quá hẹp thì việc sắp tới hạn trông như việc
       của tuần sau. */
    expect(conBaoLau(cong(120), MOC)?.gap).toBe(true);
    expect(conBaoLau(cong(300), MOC)?.gap).toBe(false);
    expect(conBaoLau(cong(4320), MOC)?.gap).toBe(false);
  });
});
