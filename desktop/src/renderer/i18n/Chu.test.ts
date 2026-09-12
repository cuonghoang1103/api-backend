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
import { boNguCanh } from './index';
import { TU_DIEN } from './tuDien';

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

describe('tiền tố ngữ cảnh', () => {
  it('⛔ gỡ tiền tố khi trả về tiếng Việt', () => {
    // `'hoatdong|Học tập'` phải hiện ra là "Học tập", không phải cả khoá.
    // Thiếu bước gỡ thì người dùng tiếng Việt nhìn thấy chính cái khoá kỹ thuật.
    expect(boNguCanh('hoatdong|Học tập')).toBe('Học tập');
  });

  it('câu KHÔNG có tiền tố thì để nguyên', () => {
    expect(boNguCanh('Cài đặt')).toBe('Cài đặt');
  });

  it('⛔ dấu `|` THẬT trong câu không bị cắt nhầm', () => {
    // Tiền tố phải là chữ thường/gạch dưới. "Ctrl | Alt" hay "Tên | Mô tả" là
    // chữ người dùng đọc, không phải khoá.
    expect(boNguCanh('Tên | Mô tả')).toBe('Tên | Mô tả');
    expect(boNguCanh('Bấm Ctrl|C để chép')).toBe('Bấm Ctrl|C để chép');
  });

  it('chỉ tách ở dấu `|` ĐẦU TIÊN', () => {
    expect(boNguCanh('nhom|A|B')).toBe('A|B');
  });
});

describe('⛔ THỰC THỂ HTML trong chuỗi JS KHÔNG được giải mã', () => {
  /*
   * Ca thật 11/09/2026, người dùng chụp màn hình gửi lên: ô Hook hiện đúng chữ
   *     .claude/skills/&lt;name&gt;/SKILL.md
   * thay vì `<name>`. Mã cũ viết `{dich('.claude/skills/&lt;tên&gt;/SKILL.md')}`.
   *
   * JSX CÓ giải mã thực thể HTML — nhưng chỉ trong VĂN BẢN và trong THUỘC TÍNH.
   * Trong một chuỗi JS nằm giữa `{…}` thì không ai giải mã, và React in ra đúng
   * từng ký tự. Đây là cái bẫy: cùng một dãy ký tự, đặt ở hai chỗ khác nhau cho
   * hai kết quả khác nhau, và `tsc` không thấy gì cả.
   *
   * Chốt ở đây thay vì ở BangHook.tsx: mọi câu văn xuôi đều đi qua `<Chu>`, nên
   * canh từ điển là canh được cả app.
   */
  it('không mục từ điển nào chứa &lt; &gt; &amp; — phải viết ký tự thẳng', () => {
    const xau = Object.entries(TU_DIEN)
      .filter(([vi, en]) => /&(lt|gt|amp|quot|#\d+);/.test(vi) || /&(lt|gt|amp|quot|#\d+);/.test(en))
      .map(([vi]) => vi);
    expect(
      xau,
      'Thực thể HTML trong từ điển sẽ hiện ra NGUYÊN XI trên màn hình '
      + '(chuỗi JS không được giải mã). Viết < > & thẳng:\n' + xau.join('\n'),
    ).toEqual([]);
  });

  it('BỘ DÒ CÓ HOẠT ĐỘNG — nó bắt được một mục bịa', () => {
    // Không có dòng này thì phép kiểm trên vẫn xanh kể cả khi regex sai.
    const gia = { 'a&lt;b': 'a&lt;b' };
    const xau = Object.entries(gia)
      .filter(([vi, en]) => /&(lt|gt|amp|quot|#\d+);/.test(vi) || /&(lt|gt|amp|quot|#\d+);/.test(en));
    expect(xau).toHaveLength(1);
  });

  it('`<tên>` đi qua <Chu> vẫn là `<tên>`, nằm trong mẩu MÃ', () => {
    const mau = tachDinhDang('Tạo `.claude/skills/<tên>/SKILL.md`, rồi khai `description`.');
    const ma = mau.filter((m) => m.loai === 'ma').map((m) => m.chu);
    expect(ma).toContain('.claude/skills/<tên>/SKILL.md');
    expect(mau.some((m) => m.chu.includes('&lt;'))).toBe(false);
  });
});
