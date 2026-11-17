import { describe, expect, it } from 'vitest';
import { caiDatMacDinh, chuanHoaCaiDat, chuanHoaMayChu, chuanHoaNhacNen, laMaKetNoi } from './caiDat';
import { chuanHoaDanhSach, chuanHoaNhac, chuanHoaTaoViec, thongDiepLoi } from './chuanHoa';
import { kiemId, kiemLink, kiemMucId, kiemTuyChon } from './ipc';
import { banDoTep, doanVaiTro, khopTimKiem } from './thuVien';

describe('chuanHoa phản hồi máy chủ', () => {
  it('đọc cả { success, data } lẫn mảng trần, id số, bỏ mục hỏng', () => {
    const a = chuanHoaDanhSach({ success: true, data: [{ id: 7, trangThai: 'lam', phanTram: 140, goc: 0.9 }, { khongId: 1 }] });
    expect(a).toHaveLength(1);
    expect(a[0]).toMatchObject({ id: '7', trangThai: 'lam', phanTram: 100, goc: 0.4, lang: 'auto', nhip: 'cho-giong', ketQua: [] });
    expect(chuanHoaDanhSach({ data: { jobs: [{ id: 'x', trangThai: 'XONG' }] } })[0].trangThai).toBe('xong');
    expect(chuanHoaDanhSach('rác')).toEqual([]);
  });
  it('ketQua: chỉ giữ loại hợp lệ có url + tên', () => {
    const [v] = chuanHoaDanhSach([{ id: 1, trangThai: 'xong', ketQua: [
      { loai: 'vi', ten: 'a [VI].mp4', url: 'https://r2/a', kichThuoc: '10' },
      { loai: 'la', ten: 'x', url: 'https://r2/x' },
      { loai: 'srt-vi', ten: 'a.vi.srt' },
    ] }]);
    expect(v.ketQua).toEqual([{ loai: 'vi', ten: 'a [VI].mp4', url: 'https://r2/a', kichThuoc: 10 }]);
  });
  it('tạo việc: { job, taiLen, taiLenNhac } hoặc việc trần', () => {
    expect(chuanHoaTaoViec({ success: true, data: { job: { id: 1 }, taiLen: { url: 'https://put', het: 'h' }, taiLenNhac: { url: 'https://put2' } } }))
      .toMatchObject({ viec: { id: '1' }, taiLen: { url: 'https://put', het: 'h' }, taiLenNhac: { url: 'https://put2', het: null } });
    expect(chuanHoaTaoViec({ id: 2 })).toMatchObject({ viec: { id: '2' }, taiLen: null, taiLenNhac: null });
    expect(chuanHoaTaoViec(null)).toBeNull();
  });
  it('thư viện nhạc', () => {
    expect(chuanHoaNhac({ data: [{ id: 'n1', ten: 'Lo-fi', giay: 120, giayPhep: 'CC BY 4.0' }, { id: 'n2' }] }))
      .toEqual([{ id: 'n1', ten: 'Lo-fi', tamTrang: null, giay: 120, nghiThu: null, nguon: null, giayPhep: 'CC BY 4.0' }]);
  });
  it('thông điệp lỗi', () => {
    expect(thongDiepLoi({ message: 'Hết hạn' }, 400)).toBe('Hết hạn');
    expect(thongDiepLoi(null, 401)).toMatch(/Mã kết nối/);
    expect(thongDiepLoi(null, 502)).toMatch(/502/);
  });
});

describe('cài đặt', () => {
  const md = caiDatMacDinh('/v');
  it('máy chủ: https, hoặc http chỉ localhost; cắt đuôi API', () => {
    expect(chuanHoaMayChu('https://cuongthai.com/')).toBe('https://cuongthai.com');
    expect(chuanHoaMayChu('https://cuongthai.com/api/v1/long-tieng')).toBe('https://cuongthai.com');
    expect(chuanHoaMayChu('http://127.0.0.1:4000')).toBe('http://127.0.0.1:4000');
    expect(chuanHoaMayChu('http://evil.com')).toBeNull();
    expect(chuanHoaMayChu('https://u:p@x.com')).toBeNull();
    expect(chuanHoaMayChu('file:///etc')).toBeNull();
  });
  it('giá trị sai ⇒ mặc định, kẹp khoảng', () => {
    const c = chuanHoaCaiDat({ goc: 3, ngonNgu: 'fr', nhip: 'tang-toc', mayChu: 'http://x.com', tuTaiVe: 'có' }, md);
    expect(c).toMatchObject({ goc: 0.4, ngonNgu: 'auto', nhip: 'tang-toc', mayChu: md.mayChu, tuTaiVe: true });
    expect(chuanHoaCaiDat(null, md)).toEqual(md);
  });
  it('nhạc nền: thu-vien thiếu id ⇒ về goc; âm lượng 0..1; id lạ bị bỏ', () => {
    expect(chuanHoaNhacNen({ loai: 'thu-vien' }, md.nhacNen)).toMatchObject({ loai: 'goc' });
    expect(chuanHoaNhacNen({ loai: 'thu-vien', id: 'n1', amLuong: 5 }, md.nhacNen)).toEqual({ loai: 'thu-vien', id: 'n1', amLuong: 1 });
    expect(chuanHoaNhacNen({ loai: 'khong', id: '../x' }, md.nhacNen)).toEqual({ loai: 'khong', id: null, amLuong: 0.7 });
  });
  it('mã kết nối', () => {
    expect(laMaKetNoi('ctlt_abcDEF12_-')).toBe(true);
    expect(laMaKetNoi(' ctlt_abcdefgh ')).toBe(true);
    expect(laMaKetNoi('ctlt_ngan')).toBe(false);
    expect(laMaKetNoi('sk-abcdefghijk')).toBe(false);
  });
});

describe('kiểm đầu vào IPC', () => {
  it('id, mục thư viện, link', () => {
    expect(kiemId('lt101')).toBe('lt101');
    expect(kiemId('../x')).toBeNull();
    expect(kiemMucId('2026-11-18 Rust [VI]')).toBe('2026-11-18 Rust [VI]');
    expect(kiemMucId('..')).toBeNull();
    expect(kiemMucId('a/b')).toBeNull();
    expect(kiemLink(' https://www.youtube.com/watch?v=1 ')).toBe('https://www.youtube.com/watch?v=1');
    expect(kiemLink('javascript:alert(1)')).toBeNull();
    expect(kiemLink('https://a:b@x.com')).toBeNull();
  });
  it('tuỳ chọn việc: kẹp + mặc định + tên sạch', () => {
    const md = { lang: 'zh' as const, goc: 0.15, nhip: 'cho-giong' as const, nhacNen: { loai: 'goc' as const, id: null, amLuong: 0.7 } };
    expect(kiemTuyChon({ lang: 'xx', goc: -1, tenVideo: '  A\u0000B ' }, md)).toEqual({ lang: 'zh', goc: 0, nhip: 'cho-giong', nhacNen: md.nhacNen, tenVideo: 'A B' });
    expect(kiemTuyChon(null, md)).toEqual({ lang: 'zh', goc: 0.15, nhip: 'cho-giong', nhacNen: md.nhacNen });
  });
});

describe('thư viện — vai trò tệp', () => {
  it('đoán theo quy ước đặt tên của trạm', () => {
    expect(doanVaiTro('Rust [VI].mp4')).toBe('vi');
    expect(doanVaiTro('Rust [VI + giọng gốc 15%].mp4')).toBe('vi-goc');
    expect(doanVaiTro('Rust.vi.srt')).toBe('srt-vi');
    expect(doanVaiTro('Rust.zh.srt')).toBe('srt-goc');
    expect(doanVaiTro('thong-tin.json')).toBe('thong-tin');
    expect(doanVaiTro('.ctlt.json')).toBeNull();
  });
  it('ghi chú của app thắng phép đoán; tệp không còn thì bỏ', () => {
    const ds = ['Rust (2) [VI].mp4', 'Rust [VI].mp4', 'Rust.vi.srt', 'thong-tin.json'];
    expect(banDoTep(ds, { vi: 'Rust (2) [VI].mp4', 'srt-goc': 'mat.zh.srt' })).toEqual({
      vi: 'Rust (2) [VI].mp4', 'srt-vi': 'Rust.vi.srt', 'thong-tin': 'thong-tin.json',
    });
  });
  it('tìm kiếm không dấu, nhiều từ', () => {
    expect(khopTimKiem(['Lồng tiếng Rust', 'bilibili.com'], 'long tieng')).toBe(true);
    expect(khopTimKiem(['Lồng tiếng Rust'], 'rust bili')).toBe(false);
    expect(khopTimKiem(['Đường ống'], 'duong')).toBe(true);
    expect(khopTimKiem(['x'], '  ')).toBe(true);
  });
});
