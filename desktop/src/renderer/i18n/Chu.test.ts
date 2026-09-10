/**
 * Kiểm bộ tách định dạng của `<Chu>`.
 *
 * Vì sao đáng kiểm: nó là thứ giữ cho phần NHẤN MẠNH nằm đúng chỗ sau khi
 * dịch. Trong một cảnh báo an toàn ("Chạy **mọi lệnh**…"), nhấn sai chữ là
 * đổi luôn ý nghĩa của cảnh báo — mà lỗi ấy trông vẫn "có in đậm", nên mắt
 * lướt qua không bắt được.
 */
import { describe, expect, it } from 'vitest';
import { tachDinhDang } from './Chu';

describe('tách đậm và mã', () => {
  it('câu trơn ⇒ một mẩu', () => {
    expect(tachDinhDang('Xin chào')).toEqual([{ loai: 'chu', chu: 'Xin chào' }]);
  });

  it('giữ đúng thứ tự chữ · đậm · mã', () => {
    expect(tachDinhDang('Chạy **mọi lệnh**, kể cả `rm -rf`.')).toEqual([
      { loai: 'chu', chu: 'Chạy ' },
      { loai: 'dam', chu: 'mọi lệnh' },
      { loai: 'chu', chu: ', kể cả ' },
      { loai: 'ma', chu: 'rm -rf' },
      { loai: 'chu', chu: '.' },
    ]);
  });

  it('⛔ QUÉT MỘT LƯỢT cho cả hai dấu', () => {
    // Quét hai lượt (đậm trước, mã sau) thì mẩu đậm đã tạo xong sẽ bị lượt sau
    // cắt vào giữa, và ra hai mẩu chồng nhau. Đây là lý do regex phải gộp.
    expect(tachDinhDang('**Đọc `.env`** rồi dừng')).toEqual([
      { loai: 'dam', chu: 'Đọc `.env`' },
      { loai: 'chu', chu: ' rồi dừng' },
    ]);
  });

  it('bản dịch được phép ĐẶT DẤU Ở CHỖ KHÁC — đó là cả điểm của cách này', () => {
    // Tiếng Anh nhấn "every command"; tiếng Việt nhấn "mọi lệnh". Vị trí trong
    // câu khác nhau, và cắt chuỗi theo mẩu thì không làm được điều này.
    const vi = tachDinhDang('Chạy **mọi lệnh**, kể cả loại nguy hiểm.');
    const en = tachDinhDang('Runs **every command**, including dangerous ones.');
    expect(vi.find((m) => m.loai === 'dam')?.chu).toBe('mọi lệnh');
    expect(en.find((m) => m.loai === 'dam')?.chu).toBe('every command');
  });

  it('dấu lẻ không cặp thì để nguyên, không nuốt mất chữ', () => {
    expect(tachDinhDang('2 ** 3 = 8').map((m) => m.chu).join('')).toBe('2 ** 3 = 8');
  });
});
