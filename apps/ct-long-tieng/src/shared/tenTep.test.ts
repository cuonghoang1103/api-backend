import { describe, expect, it } from 'vitest';
import { dinhDangDungLuong, dinhDangThoiLuong, kieuMime, lamSachTen, laTepNhac, laTepVideo, ngayCucBo, tachDuoi, tenKhongTrung, tenThuMucViec } from './tenTep';

describe('lamSachTen', () => {
  it('bỏ dấu phân cách và ký tự cấm — tên máy chủ không thoát được ra ngoài thư mục', () => {
    expect(lamSachTen('../../.ssh/id_rsa')).toBe('ssh id_rsa');
    expect(lamSachTen('../../.ssh/id_rsa')).not.toMatch(/[\\/]/);
    expect(lamSachTen('C:\\Windows\\x.mp4')).not.toMatch(/[\\/:]/);
    expect(lamSachTen('a<b>c:"d"|e?f*g')).toBe('a b c d e f g');
  });
  it('giữ tiếng Việt, chữ Hán, dấu ngoặc vuông của trạm', () => {
    expect(lamSachTen('Rust cơ bản [VI + giọng gốc 15%].mp4')).toBe('Rust cơ bản [VI + giọng gốc 15%].mp4');
    expect(lamSachTen('从零开始 Docker')).toBe('从零开始 Docker');
  });
  it('tên rỗng / toàn chấm ⇒ dự phòng; tên dành riêng của Windows ⇒ thêm _', () => {
    expect(lamSachTen('')).toBe('Video');
    expect(lamSachTen('..')).toBe('Video');
    expect(lamSachTen('   ', 'X')).toBe('X');
    expect(lamSachTen('CON')).toBe('_CON');
    expect(lamSachTen('nul.txt')).toBe('_nul.txt');
  });
  it('cắt dấu chấm/khoảng trắng cuối, cắt tên quá dài nhưng giữ đuôi', () => {
    expect(lamSachTen('abc. . ')).toBe('abc');
    const dai = lamSachTen(`${'x'.repeat(300)}.vi.srt`);
    expect(dai.length).toBeLessThanOrEqual(120);
    expect(dai.endsWith('.vi.srt')).toBe(true);
  });
});

describe('tachDuoi / tenKhongTrung', () => {
  it('tách đuôi thường và đuôi phụ đề hai tầng', () => {
    expect(tachDuoi('a.mp4')).toEqual({ goc: 'a', duoi: '.mp4' });
    expect(tachDuoi('Tên.vi.srt')).toEqual({ goc: 'Tên', duoi: '.vi.srt' });
    expect(tachDuoi('Tên.zh.srt')).toEqual({ goc: 'Tên', duoi: '.zh.srt' });
    expect(tachDuoi('thu-muc')).toEqual({ goc: 'thu-muc', duoi: '' });
    expect(tachDuoi('.an')).toEqual({ goc: '.an', duoi: '' });
  });
  it('không bao giờ ghi đè: thêm " (2)", " (3)"…', () => {
    const co = new Set(['a.mp4', 'a (2).mp4', 'b.vi.srt', '2026-11-18 X']);
    const daCo = (t: string) => co.has(t);
    expect(tenKhongTrung('c.mp4', daCo)).toBe('c.mp4');
    expect(tenKhongTrung('a.mp4', daCo)).toBe('a (3).mp4');
    expect(tenKhongTrung('b.vi.srt', daCo)).toBe('b (2).vi.srt');
    expect(tenKhongTrung('2026-11-18 X', daCo)).toBe('2026-11-18 X (2)');
  });
});

describe('ngày, thư mục, định dạng', () => {
  it('thư mục việc = <YYYY-MM-DD> <Tên an toàn>', () => {
    const d = new Date(2026, 10, 8, 23, 59);
    expect(ngayCucBo(d)).toBe('2026-11-08');
    expect(tenThuMucViec(d, 'Học K8s: Pod/Service')).toBe('2026-11-08 Học K8s Pod Service');
  });
  it('đuôi video / nhạc / MIME', () => {
    expect(laTepVideo('x.MP4')).toBe(true);
    expect(laTepVideo('x.mp3')).toBe(false);
    expect(laTepNhac('x.mp3')).toBe(true);
    expect(kieuMime('x.mkv')).toBe('video/x-matroska');
    expect(kieuMime('x.m4a')).toBe('audio/mp4');
    expect(kieuMime('x.zzz')).toBe('application/octet-stream');
  });
  it('dung lượng & thời lượng', () => {
    expect(dinhDangDungLuong(512)).toBe('512 B');
    expect(dinhDangDungLuong(1536)).toBe('1,5 KB');
    expect(dinhDangDungLuong(250 * 1024 * 1024)).toBe('250 MB');
    expect(dinhDangThoiLuong(65)).toBe('1:05');
    expect(dinhDangThoiLuong(3725)).toBe('1:02:05');
    expect(dinhDangThoiLuong(-1)).toBe('0:00');
  });
});
