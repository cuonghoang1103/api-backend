import { describe, expect, it } from 'vitest';
import { tachTen } from './TaiNhacLen';

/**
 * Tách tên file thành nghệ sĩ + tên bài.
 *
 * `artist` là trường BẮT BUỘC của `POST /music/tracks` (400 MISSING_ARTIST nếu
 * trống), nên hàm này không bao giờ được trả chuỗi rỗng — đó là lý do có nhánh
 * "Không rõ nghệ sĩ".
 */
describe('tachTen', () => {
  it('tách theo dấu gạch giữa hai khoảng trắng', () => {
    expect(tachTen('Sơn Tùng M-TP - Âm Thầm Bên Em.mp3'))
      .toEqual({ artist: 'Sơn Tùng M-TP', title: 'Âm Thầm Bên Em' });
  });

  it('giữ nguyên gạch nối TRONG tên — "M-TP" không phải chỗ tách', () => {
    expect(tachTen('M-TP.mp3')).toEqual({ title: 'M-TP', artist: 'Không rõ nghệ sĩ' });
  });

  it('nhiều dấu gạch thì chỉ tách ở dấu ĐẦU, phần sau giữ nguyên', () => {
    expect(tachTen('DJ Tilo - Nonstop 2026 - Vol 7.flac'))
      .toEqual({ artist: 'DJ Tilo', title: 'Nonstop 2026 - Vol 7' });
  });

  it('không có nghệ sĩ thì vẫn có giá trị, không bao giờ rỗng', () => {
    expect(tachTen('bai-hat-cua-toi.wav'))
      .toEqual({ title: 'bai-hat-cua-toi', artist: 'Không rõ nghệ sĩ' });
  });

  it('bỏ đúng phần đuôi cuối cùng, không cắt nhầm dấu chấm trong tên', () => {
    expect(tachTen('Vol.2 - Mixtape.m4a'))
      .toEqual({ artist: 'Vol.2', title: 'Mixtape' });
  });

  it('tên chỉ có đuôi thì không trả tên rỗng', () => {
    expect(tachTen('.mp3').title).not.toBe('');
  });
});
