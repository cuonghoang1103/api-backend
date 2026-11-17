import { describe, expect, it } from 'vitest';
import type { Viec } from './hopDong';
import { giayDaTroi, laLoiTaiLink, tinhHienThi } from './trangThai';

const v = (p: Partial<Viec>): Viec => ({
  id: '1', url: null, tenTep: null, tenVideo: null, lang: 'auto', goc: 0.15, nhip: 'cho-giong', trangThai: 'cho', buoc: null,
  phanTram: null, loi: null, ketQua: [], thoiLuong: null, tao: '2026-11-18T00:00:00Z', xong: null, ...p,
});

describe('tinhHienThi — trạng thái máy chủ', () => {
  it('ánh xạ mọi trạng thái', () => {
    expect(tinhHienThi(v({ trangThai: 'cho_tai_len' }))).toMatchObject({ chip: 'cho', dangChay: true, ketThuc: false });
    expect(tinhHienThi(v({ trangThai: 'cho' }))).toMatchObject({ chip: 'cho', nhan: 'Đang chờ trạm', buoc: 'Trong hàng đợi' });
    expect(tinhHienThi(v({ trangThai: 'tai', phanTram: 40 }))).toMatchObject({ chip: 'chay', phanTram: 40, dangChay: true });
    expect(tinhHienThi(v({ trangThai: 'lam', buoc: 'Dịch', phanTram: 70 }))).toMatchObject({ chip: 'chay', buoc: 'Dịch', nhan: 'Đang lồng tiếng' });
    expect(tinhHienThi(v({ trangThai: 'loi', loi: 'hỏng' }))).toMatchObject({ chip: 'loi', buoc: 'hỏng', dangChay: false, ketThuc: true });
    expect(tinhHienThi(v({ trangThai: 'huy' }))).toMatchObject({ chip: 'huy', ketThuc: true });
  });
  it('xong: phân biệt chờ tải về / đã tải về', () => {
    const xong = v({ trangThai: 'xong', ketQua: [{ loai: 'vi', ten: 'a', url: 'u', kichThuoc: 1 }] });
    expect(tinhHienThi(xong)).toMatchObject({ chip: 'xong', nhan: 'Xong — chờ tải về', dangChay: false });
    expect(tinhHienThi(xong, { daTaiVe: true })).toMatchObject({ nhan: 'Đã tải về', buoc: 'Có trong Thư viện' });
  });
});

describe('tinhHienThi — việc ở máy này thắng trạng thái máy chủ', () => {
  it('tải lên / tải về / yt-dlp / lỗi cục bộ', () => {
    expect(tinhHienThi(v({ trangThai: 'cho_tai_len' }), { taiLen: { daGui: 25, tong: 100 } })).toMatchObject({ nhan: 'Đang tải lên', phanTram: 25, dangChay: true });
    expect(tinhHienThi(v({ trangThai: 'xong' }), { taiVe: { daNhan: 1, tong: 3, tep: 'Tải a.mp4' } })).toMatchObject({ nhan: 'Đang tải về', phanTram: 33, buoc: 'Tải a.mp4' });
    expect(tinhHienThi(v({ trangThai: 'loi' }), { ytdlp: { phanTram: null, buoc: 'Tải công cụ' } })).toMatchObject({ chip: 'chay', phanTram: null });
    expect(tinhHienThi(v({ trangThai: 'xong' }), { loiCucBo: { loai: 'tai-ve', thongDiep: 'đứt' } })).toMatchObject({ chip: 'loi', nhan: 'Tải về lỗi', buoc: 'đứt', dangChay: false });
  });
  it('tổng 0 byte ⇒ thanh vô định (null), không chia cho 0', () => {
    expect(tinhHienThi(v({}), { taiLen: { daGui: 0, tong: 0 } }).phanTram).toBeNull();
  });
});

describe('laLoiTaiLink', () => {
  it('chỉ đúng với việc LINK đang lỗi và lỗi nói về tải link', () => {
    const loi = 'Trạm không tải được link này. Hãy tải video trên máy bạn rồi kéo vào app.';
    expect(laLoiTaiLink(v({ trangThai: 'loi', url: 'https://y/x', loi }))).toBe(true);
    expect(laLoiTaiLink(v({ trangThai: 'loi', url: 'https://y/x', loi: 'ERROR: Sign in to confirm you’re not a bot' }))).toBe(true);
    expect(laLoiTaiLink(v({ trangThai: 'loi', url: null, loi }))).toBe(false);
    expect(laLoiTaiLink(v({ trangThai: 'xong', url: 'https://y/x', loi }))).toBe(false);
    expect(laLoiTaiLink(v({ trangThai: 'loi', url: 'https://y/x', loi: 'Whisper hết bộ nhớ GPU' }))).toBe(false);
  });
});

describe('giayDaTroi', () => {
  it('đếm tới lúc xong, hoặc tới bây giờ', () => {
    const tao = '2026-11-18T00:00:00Z';
    expect(giayDaTroi(tao, '2026-11-18T00:02:05Z', 0)).toBe(125);
    expect(giayDaTroi(tao, null, Date.parse(tao) + 9_999)).toBe(9);
    expect(giayDaTroi('rác', null, 1)).toBe(0);
  });
});
