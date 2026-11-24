import { describe, expect, it } from 'vitest';
import { docGioChu, docLenhHoc, docNgayChu, tachThamSo } from './hocTapLenh';

// 24/11/2026 23:30 giờ VN.
const NOW = Date.parse('2026-11-24T16:30:00.000Z');

describe('/hoc — đọc tham số', () => {
  it('tách cụm trong ngoặc kép (cả ngoặc cong)', () => {
    expect(tachThamSo('them "Ôn kana a–ka" mai 20:00')).toEqual(['them', 'Ôn kana a–ka', 'mai', '20:00']);
    expect(tachThamSo('them “Gọi về nhà” 19h')).toEqual(['them', 'Gọi về nhà', '19h']);
  });

  it('ngày theo giờ VN: mai, dd/mm, yyyy-mm-dd; ngày không có thật ⇒ null; dd/mm đã qua lâu ⇒ năm sau', () => {
    expect(docNgayChu('nay', NOW)).toBe('2026-11-24');
    expect(docNgayChu('mai', NOW)).toBe('2026-11-25');
    expect(docNgayChu('26/11', NOW)).toBe('2026-11-26');
    expect(docNgayChu('2026-12-01', NOW)).toBe('2026-12-01');
    expect(docNgayChu('31/11', NOW)).toBeNull();
    expect(docNgayChu('05/01', NOW)).toBe('2027-01-05');
    expect(docNgayChu('kana', NOW)).toBeNull();
  });

  it('giờ: 20:00, 7:05, 20h, 20h30; sai ⇒ null', () => {
    expect(docGioChu('20:00')).toBe('20:00');
    expect(docGioChu('7:05')).toBe('07:05');
    expect(docGioChu('20h')).toBe('20:00');
    expect(docGioChu('20h30')).toBe('20:30');
    expect(docGioChu('25:00')).toBeNull();
    expect(docGioChu('45')).toBeNull();
  });

  it('lệnh con', () => {
    expect(docLenhHoc('', NOW)).toEqual({ action: 'today' });
    expect(docLenhHoc('tuan', NOW)).toEqual({ action: 'week' });
    expect(docLenhHoc('xong c5', NOW)).toEqual({ action: 'done', id: 'C5' });
    expect(docLenhHoc('bo-xong C5', NOW)).toEqual({ action: 'undone', id: 'C5' });
    expect(docLenhHoc('bat-dau H12', NOW)).toEqual({ action: 'start', id: 'H12' });
    expect(docLenhHoc('ds 26/11 30/11', NOW)).toEqual({ action: 'list_personal', from: '2026-11-26', to: '2026-11-30' });
    expect(docLenhHoc('help', NOW)).toEqual({ troGiup: true });
    expect('loi' in docLenhHoc('xong', NOW)).toBe(true);
  });

  it('them: tên + ngày + giờ + phút theo thứ tự bất kỳ; số chỉ thành phút khi đã có tên', () => {
    expect(docLenhHoc('them "Ôn kana" mai 20:00 45', NOW)).toEqual({ action: 'add', title: 'Ôn kana', date: '2026-11-25', time: '20:00', minutes: 45 });
    expect(docLenhHoc('them Gọi về nhà 19h 20p', NOW)).toEqual({ action: 'add', title: 'Gọi về nhà', time: '19:00', minutes: 20 });
    expect(docLenhHoc('them Học 30 từ vựng', NOW)).toEqual({ action: 'add', title: 'Học 30 từ vựng' });
    expect(docLenhHoc('them Học 30 từ vựng 40', NOW)).toEqual({ action: 'add', title: 'Học 30 từ vựng', minutes: 40 });
    expect(docLenhHoc('them Ôn kana 45 mai', NOW)).toEqual({ action: 'add', title: 'Ôn kana', date: '2026-11-25', minutes: 45 });
    expect('loi' in docLenhHoc('them mai 20:00', NOW)).toBe(true);
  });

  it('sua: chỉ gửi trường đổi; khong-gio = bỏ giờ', () => {
    expect(docLenhHoc('sua C5 21:00', NOW)).toEqual({ action: 'edit', id: 'C5', time: '21:00' });
    expect(docLenhHoc('sua C5 khong-gio', NOW)).toEqual({ action: 'edit', id: 'C5', time: '' });
    expect(docLenhHoc('sua C5 "Tên mới" 26/11', NOW)).toEqual({ action: 'edit', id: 'C5', title: 'Tên mới', date: '2026-11-26' });
    expect('loi' in docLenhHoc('sua C5', NOW)).toBe(true);
  });

  it('không lệnh con mà có giờ ⇒ hiểu là thêm', () => {
    expect(docLenhHoc('Ôn kana 20:00', NOW)).toEqual({ action: 'add', title: 'Ôn kana', time: '20:00' });
    expect(docLenhHoc('linh tinh', NOW)).toEqual({ troGiup: true });
  });
});
